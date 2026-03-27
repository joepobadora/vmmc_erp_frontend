<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';
    import { onMount } from 'svelte';
    import { page } from '$app/state';

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);

    const p = new App.ParamBuilder(page.url.searchParams);

    // onmount
    onMount(() => {
        initFile();
    });

    // init pdf file
    async function initFile() {
        loadingDocumentFile = true;

        try {
            const result = await App.API.post('/dex/dms/drafts/view/file', { id: data.document.latest_version.file.id }, { responseType: 'blob' });

            // Convert blob to ArrayBuffer → Uint8Array
            const buf = await result.data.arrayBuffer();
            file = { data: new Uint8Array(buf) };
        } catch (err) {
            console.log(err.message + ': UNABLE TO RETRIEVE FILE');
        } finally {
            loadingDocumentFile = false;
        }
    }
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item small active">View</li>
        </ol>
    </nav>
</j.RowCol>

<div class="bg-secondary-subtle overflow-auto pt-4" style="max-height: 1500px;">
    <j.Row>
        <j.Col></j.Col>
        <j.Col>
            {#if loadingDocumentFile}
                <j.RowCol centerx>
                    <div class="spinner-border text-secondary"></div>
                </j.RowCol>
            {:else if file}
                <div>
                    <PdfViewer src={file} />
                </div>
            {/if}
        </j.Col>
        <j.Col></j.Col>
    </j.Row>
</div>
