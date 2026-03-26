<script>
    import { onMount, tick } from 'svelte';

    export let src;
    export let scale = 1.5;
    export let onLoaded = null; // callback from parent

    let numPages = 0;
    let canvases = [];

    onMount(async () => {
        const pdfjsLib = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;

        numPages = pdf.numPages;
        await tick(); // ensure canvases are in DOM

        let pageDimensions = [];
        let dimension = null;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const canvas = canvases[pageNum - 1];
            const context = canvas.getContext('2d');
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);

            await page.render({ canvasContext: context, viewport }).promise;

            // Save each page’s dimension
            pageDimensions.push({ width: canvas.width, height: canvas.height });
        }

        if (typeof onLoaded === 'function') {
            onLoaded({ numPages, pageDimensions, dimension, canvases });
        }
    });
</script>

{#each Array(numPages) as _, i}
    <canvas bind:this={canvases[i]} class="mb-4 shadow-sm"></canvas>
{/each}
