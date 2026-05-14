<script>
    /**
     * TextField.svelte
     *
     * Draggable, committable text overlay that burns text onto a shared canvas.
     * Mounted programmatically by _page.svelte into a page wrapper div.
     *
     * Props:
     *   x        – initial left in CSS pixels relative to the page wrapper
     *   y        – initial top  in CSS pixels relative to the page wrapper
     *   canvas   – the overlay HTMLCanvasElement for this page
     *   onDone() – called after commit OR remove so _page can unmount this instance
     */
    let { x = 100, y = 100, canvas = null, onDone = () => {} } = $props();

    // ── Local state ────────────────────────────────────────────────────────
    let text = $state('');
    let fontSize = $state(16); // display px

    // Live CSS-pixel position inside the page wrapper
    let posX = $state(x);
    let posY = $state(y);

    // DOM refs
    let wrapperEl = $state(null);
    let textareaEl = $state(null);

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

        // Clamp to canvas bounds so the field stays visible
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

    // ── Font size ──────────────────────────────────────────────────────────
    function increase() {
        fontSize = Math.min(fontSize + 2, 72);
    }
    function decrease() {
        fontSize = Math.max(fontSize - 2, 8);
    }

    // ── Commit: burn text onto the canvas ──────────────────────────────────
    function commit() {
        if (!canvas) {
            onDone();
            return;
        }
        if (!text.trim()) {
            onDone();
            return;
        }

        const ctx = canvas.getContext('2d');

        /**
         * WYSIWYG coordinate approach:
         *
         * Instead of trusting posX/posY (which are CSS coords relative to the
         * wrapper), we measure the actual screen positions of both the textarea
         * and the canvas using getBoundingClientRect(), then compute the offset
         * between them. This works correctly regardless of scroll, zoom, or
         * any CSS transforms applied by the parent.
         *
         * canvasRect  – where the canvas element is on screen
         * textRect    – where the textarea element is on screen
         *
         * The textarea's top-left relative to the canvas top-left, in screen px:
         *   screenOffsetX = textRect.left - canvasRect.left
         *   screenOffsetY = textRect.top  - canvasRect.top
         *
         * Scale that into canvas backing pixels:
         *   scaleX = canvas.width  / canvasRect.width
         *   scaleY = canvas.height / canvasRect.height
         *
         * Draw position in canvas pixels:
         *   drawX = screenOffsetX * scaleX
         *   drawY = screenOffsetY * scaleY
         *
         * Font size: the user sees `fontSize` CSS px on screen. The canvas
         * backing pixel equivalent is fontSize * scaleY.
         */
        const canvasRect = canvas.getBoundingClientRect();
        const textRect = textareaEl.getBoundingClientRect();

        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const drawX = (textRect.left - canvasRect.left + 5) * scaleX;
        const drawY = (textRect.top - canvasRect.top + 6) * scaleY;
        const drawFontSize = fontSize * scaleY;

        ctx.save();
        ctx.font = `${drawFontSize}px "Comic Sans MS"`;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';

        const lineHeight = drawFontSize * 1.2;
        text.split('\n').forEach((line, i) => {
            ctx.fillText(line, drawX, drawY + i * lineHeight);
        });

        ctx.restore();
        onDone();
    }

    function remove() {
        onDone();
    }

    // ── Auto-grow textarea ─────────────────────────────────────────────────
    function autoGrow(node) {
        function resize() {
            node.style.height = 'auto';
            node.style.height = node.scrollHeight + 'px';
        }
        node.addEventListener('input', resize);
        resize();
        return {
            destroy() {
                node.removeEventListener('input', resize);
            },
        };
    }
</script>

<!--
    Sits inside the position-relative page wrapper.
    z-index 10 = above the overlay canvas (z-index 5 per PDFViewer).
-->
<div bind:this={wrapperEl} data-textfield="true" class="position-absolute" style="left:{posX}px; top:{posY}px; z-index:10; min-width:160px; max-width:400px; width:max-content;">
    <!-- Toolbar -->
    <div class="d-flex align-items-center gap-1 px-1 py-1 rounded-top" style="background:rgba(255,255,255,0.92); border:1px solid #ced4da; border-bottom:none; backdrop-filter:blur(4px);">
        <!-- Drag handle -->
        <span class="text-secondary px-1" style="cursor:grab; touch-action:none; font-size:14px; line-height:1; user-select:none;" onpointerdown={onHandlePointerDown} title="Drag">⠿</span>

        <div class="vr mx-1"></div>

        <!-- Font controls -->
        <button type="button" class="btn btn-sm btn-light" title="Smaller" onclick={decrease}>
            A<sup style="font-size:8px">−</sup>
        </button>
        <span class="small text-secondary" style="min-width:22px; text-align:center;">{fontSize}</span>
        <button type="button" class="btn btn-sm btn-light" title="Larger" onclick={increase}>
            A<sup style="font-size:8px">+</sup>
        </button>

        <div class="vr mx-1"></div>

        <!-- Commit -->
        <button type="button" class="btn btn-sm btn-primary" title="Burn text to document" onclick={commit}><i class="bi bi-check"></i></button>

        <!-- Remove -->
        <button type="button" class="btn btn-sm btn-danger" title="Remove" onclick={remove}><i class="bi bi-x"></i></button>
    </div>

    <!-- Textarea -->
    <textarea
        bind:this={textareaEl}
        bind:value={text}
        use:autoGrow
        rows="1"
        placeholder="Type here…"
        class="form-control rounded-0 rounded-bottom p-1"
        style="
            font-size:{fontSize}px;
            font-family:'Comic Sans MS';
            background:transparent;
            resize:none;
            overflow:hidden;
            min-height:2em;
            width:100%;
            border:1px solid #ced4da;
            border-top:none;
            outline:none;
            line-height:1.2;
            white-space:pre;
        "
        onpointerdown={(e) => e.stopPropagation()}
    ></textarea>
</div>
