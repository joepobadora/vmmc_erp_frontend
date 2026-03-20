<script>
    import j from '$lib/components/helper';
    import { draftHasSource, draftFile } from '$lib/stores/dms';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import z from 'zod';

    let addClass = '';
    let fileInput;

    let attaching = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z.object({
        type: z.string().nonempty('Required.'),
        size: z.string().nonempty('Required.'),
    });

    function attach() {
        attaching = true;

        if ($draftFile) {
            setTimeout(() => {
                $draftHasSource = true;
                goto(`/dex/dms/drafts/create${p.toString()}`);
                attaching = false;
            }, 600);
        }
    }

    function setFile(file) {
        $draftFile = file;
        console.log($draftFile);
    }

    function handleFileChange(event) {
        $draftFile = setFile(event.target.files[0]);
    }

    function browseFiles(event) {
        event.preventDefault();
        fileInput.click();
    }

    function handleDrop(event) {
        event.preventDefault();
        addClass = '';
        $draftFile = setFile(event.dataTransfer.files[0]);
    }

    function handleDragOver(event) {
        event.preventDefault();
        addClass = 'dragover';
    }

    function handleDragLeave(event) {
        event.preventDefault();
        addClass = '';
    }

    function clear() {
        $draftFile = null;
        addClass = '';
    }

    $effect(() => {
        if (page.url.pathname == '/dex/dms/drafts/create/file-upload') {
            $draftFile = null;
            addClass = '';
        }
    });
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dms/drafts/create">Create</a></li>
            <li class="breadcrumb-item small active">File Upload</li>
        </ol>
    </nav>
</j.RowCol>
<j.RowCol>
    <j.Card>
        <j.RowCol>
            <h5>Upload a file</h5>
            <p class="small text-muted">
                Upload an existing file to create a document in the system. The file will be stored, tracked, and managed according to document control rules, with metadata captured for easy
                retrieval.
            </p>
        </j.RowCol>
        <hr class="text-muted" />
        {#if !$draftFile}
            <j.Row centerx>
                <j.Col span="6">
                    <div
                        class={`d-grid justify-content-center gap-3 ${addClass}`}
                        ondragover={handleDragOver}
                        ondragleave={handleDragLeave}
                        ondrop={handleDrop}
                        style="height:250px; border:1px dashed gray;"
                    >
                        <i class="bi bi-cloud-arrow-up align-self-end text-center fs-1"></i>
                        <p class="align-self-start justify-self-center small">
                            Drag & Drop here or <a href="" id="btnBrowseFiles" onclick={browseFiles}>Browse files</a>.
                        </p>
                    </div>
                    <input bind:this={fileInput} type="file" class="d-none" onchange={handleFileChange} />
                </j.Col>
            </j.Row>
        {:else}
            <h5>File</h5>
            <j.Row>
                <j.Col>
                    <label for="name" class="form-label small">Name</label>
                    <input value={$draftFile.name} type="text" class="form-control form-control-sm" id="name" disabled />
                </j.Col>
            </j.Row>
            <j.Row>
                <j.Col span="6">
                    <label for="name" class="form-label small">Size</label>
                    <input value={App.Format.number($draftFile.size).toFileSize()} type="text" class="form-control form-control-sm" id="name" disabled />
                </j.Col>
                <j.Col span="6">
                    <label for="name" class="form-label small">Type</label>
                    <input value={$draftFile.type} type="text" class="form-control form-control-sm" id="name" disabled />
                </j.Col>
            </j.Row>
        {/if}
        <j.RowCol>
            <p class="small">Upload reminders:</p>
            <ul class="small">
                <li>Supported documents: PDF, DOC, DOCX, XLS, XLSX, CSV</li>
                <li>Max file size: 25MB</li>
            </ul>
        </j.RowCol>

        <j.RowCol endx>
            <div class="d-flex gap-2">
                <button
                    type="button"
                    class="btn btn-light border btn-sm px-3 {attaching == true ? 'd-none' : ''}"
                    onclick={() => {
                        $draftFile = null;
                        addClass = '';
                    }}>Clear</button
                >
                <button onclick={attach} disabled={attaching} type="button" class="btn btn-primary btn-sm px-3">
                    {#if attaching}
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Attaching...
                    {:else}
                        <i class="bi bi-link-45deg me-2"></i>Attach File
                    {/if}
                </button>
            </div>
        </j.RowCol>
    </j.Card>
</j.RowCol>

<style>
    .dragover {
        background-color: whitesmoke;
    }
</style>
