<script>
    import { onMount, tick } from 'svelte';

    export let src;
    export let onLoaded = null;

    let numPages = 0;
    let pdfCanvases = []; // Background (PDF)
    let overlayCanvases = []; // Foreground (SignPad)

    onMount(async () => {
        const pdfjsLib = await import('pdfjs-dist/build/pdf.min.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;

        numPages = pdf.numPages;
        await tick();

        let pageDimensions = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const testViewport = page.getViewport({ scale: 1 });
            // const chosenScale = testViewport.width > 800 ? 1.2 : 1.5;
            const chosenScale = 1.5;
            const viewport = page.getViewport({ scale: chosenScale });

            // Set up background PDF layer
            const bgCanvas = pdfCanvases[pageNum - 1];
            const bgContext = bgCanvas.getContext('2d');

            // Set up foreground Sign layer
            const fgCanvas = overlayCanvases[pageNum - 1];

            const w = Math.floor(viewport.width);
            const h = Math.floor(viewport.height);

            // Both canvases MUST be the same size
            bgCanvas.width = fgCanvas.width = w;
            bgCanvas.height = fgCanvas.height = h;

            await page.render({ canvasContext: bgContext, viewport }).promise;
            pageDimensions.push({ width: w, height: h });
        }

        if (typeof onLoaded === 'function') {
            // WE SEND overlayCanvases BACK TO YOUR handleLoaded
            onLoaded({ numPages, pageDimensions, canvases: overlayCanvases });
        }
    });
</script>

{#each Array(numPages) as _, i}
    <div class="position-relative mb-4" style="width: fit-content; margin: auto;">
        <!-- The PDF Layer -->
        <canvas bind:this={pdfCanvases[i]} class="shadow-sm"></canvas>

        <!-- The Signature Layer (Passed to handleLoaded) -->
        <canvas bind:this={overlayCanvases[i]} class="position-absolute top-0 start-0" style="background: transparent; z-index: 5; touch-action: none;"></canvas>
    </div>
{/each}
