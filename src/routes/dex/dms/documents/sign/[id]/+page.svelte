<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import TextField from '../../../../components/TextField.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import { onMount, onDestroy, mount, unmount } from 'svelte';
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

    // ── Add-Text state ─────────────────────────────────────────────────────
    let addTextMode = $state(false);

    /**
     * Per-page click listeners and mounted TextField instances.
     * pageWrappers[i]  – the position-relative div (canvas.parentElement)
     * pageListeners[i] – the click handler attached to it
     * tfInstances      – flat list of { destroy } from mount(), for cleanup
     */
    let pageWrappers = [];
    let pageListeners = [];
    let tfInstances = [];

    const p = new App.ParamBuilder(page.url.searchParams);

    onMount(() => {
        initFile();
    });

    onDestroy(() => {
        // Unmount all live TextFields
        tfInstances.forEach(({ instance }) => unmount(instance));
        tfInstances = [];
        // Remove page click listeners
        detachAllListeners();
        // Destroy sign pads
        signPads.forEach((_, i) => {
            signPads[i] = null;
        });
    });

    // ── File init ──────────────────────────────────────────────────────────

    async function initFile() {
        loadingDocumentFile = true;
        try {
            const result = await App.API.post('/dex/dms/documents/view/file', { id: data.document.latest_version.file.id }, { responseType: 'blob' });
            const buf = await result.data.arrayBuffer();
            file = { data: new Uint8Array(buf) };
        } catch (err) {
            console.log(err.message + ': UNABLE TO RETRIEVE FILE');
        } finally {
            loadingDocumentFile = false;
        }
    }

    // ── PDF loaded callback ────────────────────────────────────────────────

    function handleLoaded(loadedData) {
        pdfData = loadedData;

        pdfData.canvases.forEach((canvas, i) => {
            // Grab the wrapper that PDFViewer created (position-relative div)
            pageWrappers[i] = canvas.parentElement;

            // Init SignPad on each overlay canvas (unchanged behaviour)
            signPads[i] = new App.SignPad(canvas);
            signPads[i].Pause();
        });
    }

    // ── Add Text toggle ────────────────────────────────────────────────────

    function toggleAddTextMode() {
        addTextMode = !addTextMode;

        if (addTextMode) {
            // Safety: exit sign mode so SignPad doesn't eat pointer events
            if (!isPaused) {
                isPaused = true;
                scrollMode();
            }
            attachPageListeners();
        } else {
            detachAllListeners();
        }
    }

    // ── Page click listeners ───────────────────────────────────────────────

    function attachPageListeners() {
        pageWrappers.forEach((wrapper, i) => {
            if (!wrapper) return;
            const listener = (e) => handleWrapperClick(e, i);
            pageListeners[i] = listener;
            wrapper.addEventListener('click', listener);
            wrapper.style.cursor = 'crosshair';
        });
    }

    function detachAllListeners() {
        pageWrappers.forEach((wrapper, i) => {
            if (!wrapper || !pageListeners[i]) return;
            wrapper.removeEventListener('click', pageListeners[i]);
            pageListeners[i] = null;
            wrapper.style.cursor = '';
        });
    }

    function handleWrapperClick(e, pageIndex) {
        // Ignore clicks that originated inside an existing TextField widget
        if (e.target.closest('[data-textfield]')) return;

        const wrapper = pageWrappers[pageIndex];
        const canvas = pdfData.canvases[pageIndex];
        const rect = wrapper.getBoundingClientRect();

        // Scale canvas backing pixels → CSS pixels
        // (PDFViewer sets canvas.width = viewport px, so scale is usually 1,
        //  but we compute it properly in case of devicePixelRatio or CSS scaling)
        const scaleX = canvas.width / canvas.offsetWidth;
        const scaleY = canvas.height / canvas.offsetHeight;

        // Click position in canvas-pixel space
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        placeTextField(pageIndex, x, y);

        // Exit add-text mode after placing; remove crosshair cursor
        addTextMode = false;
        detachAllListeners();
    }

    // ── Mount a TextField imperatively into the page wrapper ───────────────

    function placeTextField(pageIndex, x, y) {
        const wrapper = pageWrappers[pageIndex];
        const canvas = pdfData.canvases[pageIndex];

        // Convert canvas-pixel coords → CSS-pixel coords for positioning
        const scaleX = canvas.offsetWidth / canvas.width;
        const scaleY = canvas.offsetHeight / canvas.height;
        const cssX = x * scaleX;
        const cssY = y * scaleY;

        // We need a reference so the onDone callback can clean up
        let instanceRef = null;

        instanceRef = mount(TextField, {
            target: wrapper,
            props: {
                x: cssX,
                y: cssY,
                canvas,
                onDone: () => {
                    unmount(instanceRef);
                    tfInstances = tfInstances.filter((t) => t.instance !== instanceRef);
                },
            },
        });

        tfInstances.push({ instance: instanceRef });
    }

    // ── Existing toolbar actions (unchanged) ───────────────────────────────

    async function save() {
        saving = true;
        try {
            if (!(await authSave.confirm())) return;

            const loadResult = await App.API.post('/dex/dms/documents/view/file', { id: data.document.latest_version.file.id }, { responseType: 'blob' });
            const buf = await loadResult.data.arrayBuffer();

            const pdfDoc = await PDFDocument.load(new Uint8Array(buf));
            const pages = pdfDoc.getPages();

            for (let i = 0; i < signPads.length; i++) {
                const pngFile = await signPads[i].SaveAsPNG(`temp_${i}`);
                const pngBytes = await pngFile.arrayBuffer();

                const embeddedImage = await pdfDoc.embedPng(pngBytes);
                const pg = pages[i];

                pg.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: pg.getWidth(),
                    height: pg.getHeight(),
                });
            }

            const mergedPdfBytes = await pdfDoc.save();
            const finalFile = new File([mergedPdfBytes], 'signed_document.pdf', { type: 'application/pdf' });
            const formData = new FormData();
            formData.append('file', finalFile);

            const signResult = await App.API.post(`/dex/dms/documents/sign/${data.document.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

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
        // Exit add-text mode when entering sign mode
        if (!isPaused && addTextMode) {
            addTextMode = false;
            detachAllListeners();
        }
    }

    function scrollMode() {
        for (let i = 0; i < signPads.length; i++) signs[i] = signPads[i].Pause();
    }

    function signMode() {
        for (let i = 0; i < signPads.length; i++) signs[i] = signPads[i].Resume();
    }

    function clear() {
        for (let i = 0; i < signPads.length; i++) signs[i] = signPads[i].ClearCanvas();
    }
</script>

<Auth bind:me={authSave} warning="You are about to sign a document." />

<!-- breadcrumbs -->
<j.RowCol>
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

    <!-- Toolbar -->
    <div class="d-flex gap-2 sticky-bottom justify-content-end p-2">
        <button type="button" class="btn btn-light border btn-sm px-3" onclick={clear}>
            <i class="bi bi-eraser me-2"></i>Clear
        </button>

        <button type="button" class="btn btn-light border btn-sm px-3 {isPaused ? '' : 'active'}" onclick={togglePause}>
            <i class="bi bi-{isPaused ? 'hand-index-thumb' : 'vector-pen'} me-2"></i>{isPaused ? 'Scroll Mode' : 'Sign Mode'}
        </button>

        <!-- Add Text toggle -->
        <button
            type="button"
            class="btn btn-light border btn-sm px-3 {addTextMode ? 'active' : ''}"
            onclick={toggleAddTextMode}
            title={addTextMode ? 'Click anywhere on the document to place a text box' : 'Add text to the document'}
        >
            <i class="bi bi-fonts me-2"></i>{addTextMode ? 'Click to Place…' : 'Add Text'}
        </button>

        <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
    </div>
</div>
