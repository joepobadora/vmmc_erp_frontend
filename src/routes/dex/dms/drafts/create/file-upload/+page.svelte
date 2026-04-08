<script>
    import j from '$lib/components/helper';
    import { draft } from '$lib/stores/dms';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import z from 'zod';

    let addClass = $state('');
    let fileInput;

    let attaching = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z.object({
        ext: z.string().refine(
            (value) => {
                const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
                return allowedExtensions.includes(value.toLowerCase());
            },
            {
                message: 'Invalid file type.',
            }
        ),
        size: z.number().refine(
            (value) => {
                // Define the maximum file size in bytes
                const maxSize = 25 * 1024 * 1024; // 25MB
                return value <= maxSize;
            },
            {
                message: 'File size exceeds the maximum limit.',
            }
        ),
    });

    function attach() {
        attaching = true;

        if ($draft.file) {
            setTimeout(() => {
                $draft.source = 'DOCSRC1'; // source code for file
                goto(`/dex/dms/drafts/create${p.toString()}`);
                attaching = false;
            }, 600);
        }
    }

    function setFile(file) {
        $draft.file = file;
        $draft.file.ext = $draft.file.name.split('.').pop().toUpperCase();

        const { ext, size } = $draft.file;

        const validate = schema.safeParse({
            ext,
            size,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    function browseFiles(event) {
        event.preventDefault();
        fileInput.click();
    }

    function handleDrop(event) {
        event.preventDefault();
        addClass = '';
        setFile(event.dataTransfer.files[0]);
    }

    function handleDragOver(event) {
        event.preventDefault();
        addClass = 'dragover';
    }

    function handleDragLeave(event) {
        event.preventDefault();
        addClass = '';
    }

    function reset() {
        $draft.file = null;
        addClass = '';
        errors = {};
    }

    $effect(() => {
        if (page.url.pathname == '/dex/dms/drafts/create/file-upload') {
            $draft.file = null;
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
        {#if !$draft.file}
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
                    <input value={$draft.file.name} type="text" class="form-control form-control-sm" id="name" disabled />
                </j.Col>
            </j.Row>
            <j.Row>
                <j.Col span="6">
                    <label for="name" class="form-label small">Size</label>
                    <input value={App.Format.number($draft.file.size).toFileSize()} type="text" class="form-control form-control-sm {errors.size ? 'is-invalid' : ''}" id="name" disabled />
                    <p class="text-danger small mb-auto {errors.size ? '' : 'd-none'}">{errors.size?.[0]}</p>
                </j.Col>
                <j.Col span="6">
                    <label for="name" class="form-label small">Type</label>
                    <input value={$draft.file.ext} type="text" class="form-control form-control-sm {errors.ext ? 'is-invalid' : ''}" id="name" disabled />
                    <p class="text-danger small mb-auto {errors.ext ? '' : 'd-none'}">{errors.ext?.[0]}</p>
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
                <button type="button" class="btn btn-light border btn-sm px-3 {attaching == true || !$draft.file ? 'd-none' : ''}" onclick={reset}>Change</button>
                <j.Button label="Attach File" loadinglabel="Attaching" icon="bi-link-45deg" loading={attaching} onClick={attach} disabled={errors.size || errors.ext} />
            </div>
        </j.RowCol>
    </j.Card>
</j.RowCol>

<style>
    .dragover {
        background-color: whitesmoke;
    }
</style>
