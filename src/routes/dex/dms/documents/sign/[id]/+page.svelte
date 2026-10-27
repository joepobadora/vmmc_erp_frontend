<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import TextField from '../../../../components/TextField.svelte';
    import SignatureField from '../../../../components/SignatureField.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import { onMount, onDestroy, mount, unmount } from 'svelte';
    import { page } from '$app/state';
    import { PDFDocument } from 'pdf-lib';
    import Auth from '$lib/components/Auth.svelte';
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores/access';

    let authSave = $state();
    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let signPads = $state([]);
    let signs = $state([]);

    let isPaused = $state(true);
    let saving = $state(false);

    // Add dynamic states:
    let isLockedByMe = $state(false);
    let isLockedByOther = $state(false);
    let checkingLock = $state(true);

    // ── Interaction modes ──────────────────────────────────────────────────
    let addTextMode = $state(false);
    let addSavedSignMode = $state(false);

    // Pre-saved signature state
    let savedSignatureBlob = $state(null);

    /**
     * Per-page click listeners and mounted imperatively-created component instances.
     * Stores instances of { instance } returned by mount() for global unmount cleanup.
     */
    let pageWrappers = [];
    let pageListeners = [];
    let activeComponentInstances = [];

    const p = new App.ParamBuilder(page.url.searchParams);

    onMount(async () => {
        // Check if I already hold the lock from page load data
        if (data.document.state.locker_id == $user.account_id) {
            isLockedByMe = true;
            checkingLock = false;
            initFile();
            preloadSavedSignature();
        } else {
            await lock();
        }
    });

    onDestroy(() => {
        // Unmount all live TextFields and SignatureFields
        activeComponentInstances.forEach(({ instance }) => unmount(instance));
        activeComponentInstances = [];

        // Remove page click listeners
        detachAllListeners();

        // Nullify sign pads
        signPads.forEach((_, i) => {
            signPads[i] = null;
        });

        // unlock document
        if (isLockedByMe) {
            unlock();
        }
    });

    // document locking

    async function lock() {
        checkingLock = true;
        try {
            const res = await App.API.post(`/dex/dms/checkout/${data.document.id}`);

            if (res.data.success) {
                isLockedByMe = true;
                isLockedByOther = false;
                initFile();
                preloadSavedSignature();
            } else {
                isLockedByOther = true;
                isLockedByMe = false;
            }
        } catch (err) {
            console.error('Failed to lock on mount:', err);
            isLockedByOther = true;
            isLockedByMe = false;
        } finally {
            checkingLock = false;
        }
    }

    async function unlock() {
        try {
            // Using navigator.sendBeacon or a standard async call on exit
            await App.API.post(`/dex/dms/checkin/${data.document.id}`);
        } catch (err) {
            console.error('Failed to release lock on exit:', err);
        }
    }

    // ── Preload user's saved signature PNG from server ────────────────────

    async function preloadSavedSignature() {
        try {
            const res = await App.API.get('/settings/signature', { responseType: 'blob' });
            if (res.data && res.data.size > 0) {
                savedSignatureBlob = res.data;
            }
        } catch (err) {
            // User may not have a pre-saved signature uploaded
            savedSignatureBlob = null;
        }
    }

    // ── File initialization ───────────────────────────────────────────────

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
            pageWrappers[i] = canvas.parentElement;

            signPads[i] = new App.SignPad(canvas);
            signPads[i].Pause();
            canvas.style.pointerEvents = 'none';
        });
    }

    // ── Interaction Mode toggles ──────────────────────────────────────────

    function toggleAddTextMode() {
        addTextMode = !addTextMode;
        addSavedSignMode = false;

        if (addTextMode) {
            if (!isPaused) {
                isPaused = true;
                scrollMode();
            }
            attachPageListeners();
        } else {
            detachAllListeners();
        }
    }

    function toggleAddSavedSignMode() {
        if (!savedSignatureBlob) {
            Alert.show('warning', 'No saved signature found', 'Please upload a signature PNG in your settings first.');
            return;
        }

        addSavedSignMode = !addSavedSignMode;
        addTextMode = false;

        if (addSavedSignMode) {
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

            if (pdfData?.canvases[i]) {
                pdfData.canvases[i].style.pointerEvents = 'none';
            }
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
        // Prevent placing if clicking directly inside an active widget
        if (e.target.closest('[data-textfield]') || e.target.closest('[data-signaturefield]')) return;

        const wrapper = pageWrappers[pageIndex];
        const canvas = pdfData.canvases[pageIndex];
        const rect = wrapper.getBoundingClientRect();

        const scaleX = canvas.width / canvas.offsetWidth;
        const scaleY = canvas.height / canvas.offsetHeight;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        if (addTextMode) {
            placeTextField(pageIndex, x, y);
            addTextMode = false;
        } else if (addSavedSignMode) {
            placeSignatureField(pageIndex, x, y);
            addSavedSignMode = false;
        }

        detachAllListeners();
    }

    // ── Mount TextField widget imperatively ───────────────────────────────

    function placeTextField(pageIndex, x, y) {
        const wrapper = pageWrappers[pageIndex];
        const canvas = pdfData.canvases[pageIndex];

        const scaleX = canvas.offsetWidth / canvas.width;
        const scaleY = canvas.offsetHeight / canvas.height;
        const cssX = x * scaleX;
        const cssY = y * scaleY;

        let instanceRef = null;

        instanceRef = mount(TextField, {
            target: wrapper,
            props: {
                x: cssX,
                y: cssY,
                canvas,
                onDone: () => {
                    unmount(instanceRef);
                    activeComponentInstances = activeComponentInstances.filter((t) => t.instance !== instanceRef);
                },
            },
        });

        activeComponentInstances.push({ instance: instanceRef });
    }

    // ── Mount SignatureField widget imperatively ──────────────────────────

    function placeSignatureField(pageIndex, x, y) {
        const wrapper = pageWrappers[pageIndex];
        const canvas = pdfData.canvases[pageIndex];

        const scaleX = canvas.offsetWidth / canvas.width;
        const scaleY = canvas.offsetHeight / canvas.height;
        const cssX = x * scaleX;
        const cssY = y * scaleY;

        let instanceRef = null;

        instanceRef = mount(SignatureField, {
            target: wrapper,
            props: {
                x: cssX,
                y: cssY,
                canvas,
                blob: savedSignatureBlob,
                onDone: () => {
                    unmount(instanceRef);
                    activeComponentInstances = activeComponentInstances.filter((t) => t.instance !== instanceRef);
                },
            },
        });

        activeComponentInstances.push({ instance: instanceRef });
    }

    // ── Save action ────────────────────────────────────────────────────────

    async function save() {
        saving = true;
        try {
            if (!(await authSave.confirm())) return;

            // Fetch clean base document
            const loadResult = await App.API.post('/dex/dms/documents/view/file', { id: data.document.latest_version.file.id }, { responseType: 'blob' });
            const buf = await loadResult.data.arrayBuffer();

            const pdfDoc = await PDFDocument.load(new Uint8Array(buf));
            const pages = pdfDoc.getPages();

            // Embed all signatures & text burned onto the page canvases
            for (let i = 0; i < signPads.length; i++) {
                if (!signPads[i] || !pages[i]) continue;

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

        if (!isPaused && (addTextMode || addSavedSignMode)) {
            addTextMode = false;
            addSavedSignMode = false;
            detachAllListeners();
        }
    }

    function scrollMode() {
        for (let i = 0; i < signPads.length; i++) {
            if (signPads[i]) {
                signs[i] = signPads[i].Pause();
                if (pdfData?.canvases[i]) pdfData.canvases[i].style.pointerEvents = 'none';
            }
        }
    }

    function signMode() {
        for (let i = 0; i < signPads.length; i++) {
            if (signPads[i]) {
                signs[i] = signPads[i].Resume();
                if (pdfData?.canvases[i]) pdfData.canvases[i].style.pointerEvents = 'auto';
            }
        }
    }

    function clear() {
        for (let i = 0; i < signPads.length; i++) {
            if (signPads[i]) signs[i] = signPads[i].ClearCanvas();
        }
    }
</script>

<Auth bind:me={authSave} warning="You are about to sign a document." />

<!-- Breadcrumbs -->
<j.RowCol>
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dms/documents{p.toString()}">(Document Manager) Documents</a></li>
            <li class="breadcrumb-item active">Sign</li>
        </ol>
    </nav>
</j.RowCol>

{#if checkingLock}
    <div class="d-flex justify-content-center align-items-center p-5">
        <div class="spinner-border text-secondary" role="status"></div>
        <span class="ms-2 text-secondary">Checking document lock...</span>
    </div>
{:else if isLockedByOther}
    <div class="row mb-0 justify-content-center m-10">
        <div class="col-12 col-md-8 text-center">
            <div class="vh-50">
                <div class="h-75 d-flex flex-column justify-content-center align-items-center">
                    <h2><i class="bi bi-file-earmark-lock2 me-2"></i>Document Locked</h2>
                    <p class="text-muted small">This document is currently checked out and being signed or edited by another user. Please try again later.</p>
                    <!-- <button class="btn btn-primary btn-sm px-3 mt-3" onclick={() => window.history.back()}>
                        <i class="bi bi-chevron-left me-2"></i>Go back
                    </button> -->
                </div>
            </div>
        </div>
    </div>
{:else if isLockedByMe}
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
        <div class="d-flex gap-2 sticky-bottom justify-content-end p-2 bg-white border-top shadow-sm">
            <button type="button" class="btn btn-light border btn-sm px-3" onclick={clear}>
                <i class="bi bi-eraser me-2"></i>Clear
            </button>

            <button type="button" class="btn btn-light border btn-sm px-3 {isPaused ? '' : 'active'}" onclick={togglePause}>
                <i class="bi bi-{isPaused ? 'hand-index-thumb' : 'vector-pen'} me-2"></i>{isPaused ? 'Scroll Mode' : 'Sign Mode'}
            </button>

            <!-- Place Pre-saved Signature button -->
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {addSavedSignMode ? 'active' : ''}"
                onclick={toggleAddSavedSignMode}
                disabled={!savedSignatureBlob}
                title={savedSignatureBlob ? 'Click to place your saved signature on the document' : 'No saved signature found'}
            >
                <i class="bi bi-file-image me-2"></i>{addSavedSignMode ? 'Click Page to Attach…' : 'Attach Saved Signature'}
            </button>

            <!-- Add Text button -->
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
{/if}
