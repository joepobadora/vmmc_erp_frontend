<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';
    import { onMount } from 'svelte';
    import { onDestroy } from 'svelte';
    import { page } from '$app/state';

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let signPads = $state([]);
    let signs = $state([]);

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
        });
    }

    // Cleanup must be declared at top-level
    onDestroy(() => {
        signPads.forEach((pad, i) => {
            signPads[i] = null;
        });
    });

    async function save() {
        for (let i = 0; i < signPads.length; i++) {
            signs[i] = await signPads[i].SaveAsPNG('signature');
        }
        console.log(signs[1]);
    }
</script>

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
        <button type="button" class="btn btn-light border btn-sm px-3"><i class="bi bi-vector-pen me-2"></i>Toggle Sign</button>
        <j.Button label="Save" loadinglabel="Downloading" icon="bi-check-lg" />
    </div>
</div>

<button onclick={save}>save</button>

<!-- <p>Total pages: {pdfData?.numPages}</p>
{#each pdfData?.pageDimensions as dim, i}
    <p>Page size: {dim?.width} × {dim?.height}</p>
{/each} -->
