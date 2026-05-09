<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import { onMount } from 'svelte';
    import { onDestroy } from 'svelte';
    import { page } from '$app/state';
    import { PDFDocument } from 'pdf-lib';
    import Auth from '$lib/components/Auth.svelte';
    import { goto } from '$app/navigation';

    let authSave = $state();

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let signPads = $state([]);
    let signs = $state([]);

    let isPaused = $state(true);
    let saving = $state(false);

    const p = new App.ParamBuilder(page.url.searchParams);

    // onmount
    onMount(() => {
        initFile();
    });

    // init pdf file
    async function initFile() {
        loadingDocumentFile = true;

        try {
            const result = await App.API.post('/dex/dms/documents/view/file', { id: data.document.latest_version.file.id }, { responseType: 'blob' });

            // Convert blob to ArrayBuffer → Uint8Array
            const buf = await result.data.arrayBuffer();
            file = { data: new Uint8Array(buf) };
        } catch (err) {
            console.log(err.message + ': UNABLE TO RETRIEVE FILE');
        } finally {
            loadingDocumentFile = false;
        }
    }

    function handleLoaded(data) {
        pdfData = data;

        // Initialize SignPad for each overlay canvas
        pdfData.canvases.forEach((canvas, i) => {
            signPads[i] = new App.SignPad(canvas);
            signPads[i].Pause();
        });
    }

    // Cleanup must be declared at top-level
    onDestroy(() => {
        signPads.forEach((pad, i) => {
            signPads[i] = null;
        });
    });

    async function save() {
        saving = true;

        try {
            // password auth
            if (!(await authSave.confirm())) return;

            // IMPORTANT: Create a fresh Uint8Array from the state to avoid detached buffer issues
            const loadResult = await App.API.post('/dex/dms/documents/view/file', { id: data.document.latest_version.file.id }, { responseType: 'blob' });

            // Convert blob to ArrayBuffer → Uint8Array
            const buf = await loadResult.data.arrayBuffer();

            // 1. Load the existing PDF bytes you got from initFile()
            const pdfDoc = await PDFDocument.load(new Uint8Array(buf));
            const pages = pdfDoc.getPages();

            // 2. Loop through each signPad
            for (let i = 0; i < signPads.length; i++) {
                // Get PNG as ArrayBuffer
                const pngFile = await signPads[i].SaveAsPNG(`temp_${i}`);
                const pngBytes = await pngFile.arrayBuffer();

                // Embed the PNG into the PDF
                const embeddedImage = await pdfDoc.embedPng(pngBytes);
                const page = pages[i];

                // Draw the signature over the entire page
                // (Since canvas and PDF page sizes were matched in PdfViewer)
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: page.getWidth(),
                    height: page.getHeight(),
                });
            }

            // 3. Serialize the PDF to bytes
            const mergedPdfBytes = await pdfDoc.save();

            /*
            // --- DEBUG MODE: View in New Tab ---

            // Create a Blob from the bytes
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

            // Create a temporary URL for the blob
            const pdfUrl = URL.createObjectURL(blob);

            // Open the URL in a new browser tab
            window.open(pdfUrl, '_blank');

            console.log('PDF generated locally. Check the new tab!');
            */

            // --- BACKEND UPLOAD (Commented Out for Debugging) ---

            const finalFile = new File([mergedPdfBytes], 'signed_document.pdf', { type: 'application/pdf' });
            const formData = new FormData();
            formData.append('file', finalFile);

            const signResult = await App.API.post(`/dex/dms/documents/sign/${data.document.id}`, formData, {
                headers: {
                    // Let Axios set the boundary automatically
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (signResult.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/documents${p.toString()}`);
                    Alert.show('success', 'Signing success.', signResult.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Signing failed.', signResult.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            saving = false;
        }
    }

    function togglePause() {
        isPaused = !isPaused;

        if (isPaused) {
            scrollMode();
        } else {
            signMode();
        }
    }

    function scrollMode() {
        for (let i = 0; i < signPads.length; i++) {
            signs[i] = signPads[i].Pause();
        }
    }

    function signMode() {
        for (let i = 0; i < signPads.length; i++) {
            signs[i] = signPads[i].Resume();
        }
    }

    function clear() {
        for (let i = 0; i < signPads.length; i++) {
            signs[i] = signPads[i].ClearCanvas();
        }
    }
</script>

<Auth bind:me={authSave} warning="You are about to sign a document." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dms/documents{p.toString()}">(Document Manager) Documents</a></li>
            <li class="breadcrumb-item active">Sign</li>
        </ol>
    </nav>
</j.RowCol>

<div class="position-relative">
    <div class="bg-secondary-subtle overflow-auto pt-4 mb-3" style="max-height: 1500px;">
        <j.Row>
            <j.Col></j.Col>
            <j.Col>
                {#if loadingDocumentFile}
                    <j.RowCol centerx>
                        <div class="spinner-border text-secondary"></div>
                    </j.RowCol>
                {:else if file}
                    <div>
                        <PdfViewer src={file} onLoaded={handleLoaded} />
                    </div>
                {/if}
            </j.Col>
            <j.Col></j.Col>
        </j.Row>
    </div>
    <div class="d-flex gap-2 sticky-bottom justify-content-end p-2">
        <button type="button" class="btn btn-light border btn-sm px-3" onclick={clear}><i class="bi bi-eraser me-2"></i>Clear</button>
        <button type="button" class="btn btn-light border btn-sm px-3 {isPaused ? '' : 'active'}" onclick={togglePause}
            ><i class="bi bi-{isPaused ? 'hand-index-thumb' : 'vector-pen'} me-2"></i>{isPaused ? 'Scroll Mode' : 'Sign Mode'}</button
        >
        <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
    </div>
</div>

<!-- <p>Total pages: {pdfData?.numPages}</p>
{#each pdfData?.pageDimensions as dim, i}
    <p>Page size: {dim?.width} × {dim?.height}</p>
{/each} -->
