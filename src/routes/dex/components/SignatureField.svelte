<script>
    /**
     * SignatureField.svelte
     *
     * Draggable, resizable signature overlay that burns a signature PNG onto a shared canvas.
     * Mounted programmatically into a page wrapper div.
     *
     * Props:
     *   x        – initial left in CSS pixels relative to the page wrapper
     *   y        – initial top  in CSS pixels relative to the page wrapper
     *   canvas   – the overlay HTMLCanvasElement for this page
     *   blob     – signature PNG blob instance
     *   onDone() – called after commit OR remove so parent can unmount this instance
     */
    let { x = 100, y = 100, canvas = null, blob = null, onDone = () => {} } = $props();

    // ── Local state ────────────────────────────────────────────────────────
    let width = $state(180); // Initial CSS width px
    let height = $state(70); // Initial CSS height px

    // Live CSS-pixel position inside the page wrapper
    let posX = $state(x);
    let posY = $state(y);

    // DOM refs
    let wrapperEl = $state(null);
    let imgEl = $state(null);

    // Object URL for img display
    let objectUrl = $state(blob ? URL.createObjectURL(blob) : '');

    // ── Drag (pointer events → works for mouse + touch) ────────────────────
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let originX = 0;
    let originY = 0;

    function onHandlePointerDown(e) {
        e.preventDefault();
        e.stopPropagation();
        dragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        originX = posX;
        originY = posY;
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }

    function onPointerMove(e) {
        if (!dragging) return;
        let nx = originX + (e.clientX - dragStartX);
        let ny = originY + (e.clientY - dragStartY);

        // Clamp to canvas bounds so the signature stays visible
        if (canvas && wrapperEl) {
            nx = Math.max(0, Math.min(nx, canvas.offsetWidth - wrapperEl.offsetWidth));
            ny = Math.max(0, Math.min(ny, canvas.offsetHeight - wrapperEl.offsetHeight));
        }
        posX = nx;
        posY = ny;
    }

    function onPointerUp() {
        dragging = false;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    }

    // ── Interactive Resizing ───────────────────────────────────────────────
    let resizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let startWidth = 0;
    let startHeight = 0;

    function onResizePointerDown(e) {
        e.preventDefault();
        e.stopPropagation();
        resizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        startWidth = width;
        startHeight = height;
        window.addEventListener('pointermove', onResizePointerMove);
        window.addEventListener('pointerup', onResizePointerUp);
    }

    function onResizePointerMove(e) {
        if (!resizing) return;
        const dx = e.clientX - resizeStartX;
        const dy = e.clientY - resizeStartY;

        // Maintain minimum dimensions
        width = Math.max(60, startWidth + dx);
        height = Math.max(25, startHeight + dy);
    }

    function onResizePointerUp() {
        resizing = false;
        window.removeEventListener('pointermove', onResizePointerMove);
        window.removeEventListener('pointerup', onResizePointerUp);
    }

    // ── Commit: burn signature image onto canvas with aspect ratio locking ──
    function commit() {
        if (!canvas || !blob || !imgEl) {
            cleanup();
            onDone();
            return;
        }

        const ctx = canvas.getContext('2d');

        /**
         * WYSIWYG coordinate approach with aspect-ratio preservation
         */
        const canvasRect = canvas.getBoundingClientRect();
        const imgRect = imgEl.getBoundingClientRect();

        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const containerDrawX = (imgRect.left - canvasRect.left) * scaleX;
        const containerDrawY = (imgRect.top - canvasRect.top) * scaleY;
        const containerDrawWidth = imgRect.width * scaleX;
        const containerDrawHeight = imgRect.height * scaleY;

        const tempImg = new Image();
        tempImg.onload = () => {
            // Calculate aspect ratio fit (mimics object-fit: contain)
            const imgRatio = tempImg.naturalWidth / tempImg.naturalHeight;
            const containerRatio = containerDrawWidth / containerDrawHeight;

            let finalWidth = containerDrawWidth;
            let finalHeight = containerDrawHeight;
            let offsetX = 0;
            let offsetY = 0;

            if (imgRatio > containerRatio) {
                finalHeight = containerDrawWidth / imgRatio;
                offsetY = (containerDrawHeight - finalHeight) / 2;
            } else {
                finalWidth = containerDrawHeight * imgRatio;
                offsetX = (containerDrawWidth - finalWidth) / 2;
            }

            ctx.drawImage(tempImg, containerDrawX + offsetX, containerDrawY + offsetY, finalWidth, finalHeight);

            cleanup();
            onDone();
        };
        tempImg.src = objectUrl;
    }

    function remove() {
        cleanup();
        onDone();
    }

    function cleanup() {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
    }
</script>

<!--
    Sits inside the position-relative page wrapper.
    z-index 10 = above the overlay canvas (z-index 5 per PDFViewer).
-->
<div bind:this={wrapperEl} data-signaturefield="true" class="position-absolute" style="left:{posX}px; top:{posY}px; z-index:10; width:max-content;">
    <!-- Toolbar -->
    <div class="d-flex align-items-center gap-1 px-1 py-1 rounded-top" style="background:rgba(255,255,255,0.92); border:1px solid #ced4da; border-bottom:none; backdrop-filter:blur(4px);">
        <!-- Drag handle -->
        <span class="text-secondary px-1" style="cursor:grab; touch-action:none; font-size:14px; line-height:1; user-select:none;" onpointerdown={onHandlePointerDown} title="Drag">⠿</span>

        <div class="vr mx-1"></div>

        <!-- Commit -->
        <button type="button" class="btn btn-sm btn-primary" title="Burn signature to document" onclick={commit}>
            <i class="bi bi-check"></i>
        </button>

        <!-- Remove -->
        <button type="button" class="btn btn-sm btn-danger" title="Remove" onclick={remove}>
            <i class="bi bi-x"></i>
        </button>
    </div>

    <!-- Transparent Image Box with Drag Resize Corner -->
    <div
        class="position-relative rounded-bottom p-1 d-flex align-items-center justify-content-center"
        style="
            border: 1px dashed #0d6efd;
            border-top: none;
            background: rgba(255, 255, 255, 0.35);
            backdrop-filter: blur(2px);
            width: {width}px;
            height: {height}px;
        "
    >
        <img bind:this={imgEl} src={objectUrl} alt="Signature" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;" />

        <!-- Resize handle (Bottom-Right) -->
        <div class="position-absolute bottom-0 end-0 p-1" style="cursor: se-resize; touch-action: none; line-height: 1; user-select: none;" onpointerdown={onResizePointerDown} title="Resize">
            <i class="bi bi-arrows-angle-expand text-primary" style="font-size: 10px;"></i>
        </div>
    </div>
</div>
