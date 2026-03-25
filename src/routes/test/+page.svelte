<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { onDestroy } from 'svelte';

    let pdfInfo = $state(null);

    let signPads = $state([]);
    let signs = $state([]);

    function handleLoaded(data) {
        pdfInfo = data;

        // Initialize SignPad for each overlay canvas
        pdfInfo.canvases.forEach((canvas, i) => {
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
        console.log(signs);
    }
</script>

<div class="flex justify-center">
    <PdfViewer src="/my-document.pdf" onLoaded={handleLoaded} />
    <!-- <div class="position-absolute top-0 left-0">
            {#if pdfInfo}
                {#each pdfInfo.pageDimensions as dim, i}
                    <canvas bind:this={canvasEls[i]} class="mb-4" style="width: {dim.width}px; height: {dim.height}px;"></canvas>
                {/each}
            {/if}
        </div> -->
</div>

<button onclick={save}>save</button>

<p>Total pages: {pdfInfo?.numPages}</p>
{#each pdfInfo?.pageDimensions as dim, i}
    <p>Page size: {dim?.width} × {dim?.height}</p>
{/each}
