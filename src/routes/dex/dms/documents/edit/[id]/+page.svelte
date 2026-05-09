<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    let authSave = $state();
    let authArchive = $state();
    let authTrash = $state();

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let doc = $state(data.document);
    let tag = $state(null);

    let typeList = $state(data.typeList ?? []);
    let tagList = $state(data.tagList ?? []);

    let activeTab = $state('overview');

    let saving = $state(false);
    let archiving = $state(false);
    let trashing = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    async function save() {
        // saving account
        try {
            // password auth
            if (!(await authSave.confirm())) return;

            // udpate button state
            saving = true;

            const result = await App.API.post(`/dex/dms/documents/update/${page.params.id}`, {
                tags: JSON.stringify(doc.tags),
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/documents${p.toString()}`);
                    Alert.show('success', 'Saving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Saving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            saving = false;
        }
    }

    async function trash() {
        try {
            // password auth
            if (!(await authTrash.confirm())) return;

            // udpate button state
            deleting = true;

            const result = await App.API.post(`/dex/dms/documents/trash/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/documents${p.toString()}`);
                    Alert.show('success', 'Moving to trash success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Moving to trash failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            deleting = false;
        }
    }

    async function archive() {
        try {
            // password auth
            if (!(await authArchive.confirm())) return;

            // udpate button state
            archiving = true;

            const result = await App.API.post(`/dex/dms/documents/archive/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/documents${p.toString()}`);
                    Alert.show('success', 'Archiving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Archiving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            archiving = false;
        }
    }

    function selectTab(tab) {
        activeTab = tab;
    }

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

    function handleOnloaded(data) {
        pdfData = data;
    }

    function handleTagSelect() {
        if (!doc.tags.includes(tag)) {
            doc.tags = [...doc.tags, tag];
        }
        tag = null;
    }

    function handleTagRemove(tag) {
        doc.tags = doc.tags.filter((t) => t !== tag);
    }
</script>

<Auth bind:me={authSave} warning="You are about to update a document." />
<Auth bind:me={authTrash} warning="You are about to move the document to the trash." />
<Auth bind:me={authArchive} warning="You are about to archive a document." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dms/documents">(Document Manager) Documents</a></li>
            <li class="breadcrumb-item active">Edit</li>
        </ol>
    </nav>
</j.RowCol>

<j.RowCol>
    <ul class="nav nav-tabs small">
        <li class="nav-item">
            <a
                class="nav-link {activeTab === 'overview' ? 'active' : ''}"
                href=""
                onclick={(e) => {
                    e.preventDefault();
                    selectTab('overview');
                }}
            >
                Overview
            </a>
        </li>
        <li class="nav-item">
            <a
                class="nav-link {activeTab === 'preview' ? 'active' : ''}"
                href=""
                onclick={(e) => {
                    e.preventDefault();
                    selectTab('preview');
                }}
            >
                File Preview
            </a>
        </li>
    </ul>
</j.RowCol>

<div class="tab-content">
    <!-- OVERVIEW -->
    <div class="tab-pane {activeTab === 'overview' ? 'active' : 'd-none'}">
        <j.Card>
            <j.RowCol>
                <h5>Edit document</h5>
                <p class="small text-muted">
                    A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                </p>
            </j.RowCol>
            <hr class="text-muted" />
            <h5>Document</h5>
            <j.Row>
                <j.Col span="6">
                    <label for="username" class="form-label small">Document No.</label>
                    <input bind:value={doc.document_no} class="form-control form-control-sm" id="username" disabled />
                </j.Col>
                <j.Col span="3">
                    <label for="username" class="form-label small">Current State</label>
                    <input bind:value={doc.state.state.enumeration} class="form-control form-control-sm" id="username" disabled />
                </j.Col>
                <j.Col span="3">
                    <label for="username" class="form-label small">Variant</label>
                    <div>
                        <span class="badge bg-{doc.state.is_original == 1 ? 'primary' : 'secondary'}">{doc.state.is_original == 1 ? 'Original' : 'Reference Copy'}</span>
                    </div>
                </j.Col>
            </j.Row>
            <j.Row>
                <j.Col span="6">
                    <label for="office" class="form-label small">Document Type</label>
                    <input bind:value={doc.latest_version.document_type.name} list="typeList" type="text" class="form-control form-control-sm" id="office" placeholder="Type and choose..." disabled />
                    <datalist id="typeList">
                        {#each typeList as type}
                            <option value={type.name}></option>
                        {/each}
                    </datalist>
                </j.Col>
            </j.Row>
            <j.RowCol>
                <label for="password" class="form-label small">Name</label>
                <input bind:value={doc.latest_version.name} type="text" class="form-control form-control-sm" id="password" placeholder="Name" disabled />
            </j.RowCol>
            <j.RowCol>
                <label for="exampleFormControlTextarea1" class="form-label small">Details</label>
                <textarea bind:value={doc.latest_version.details} class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="5" disabled></textarea>
            </j.RowCol>
            <j.RowCol span="6">
                <label for="docmngtMyDocumentsStatusDropdown" class="form-label small">Tag</label>
                <select onchange={handleTagSelect} bind:value={tag} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                    {#each tagList as tag}
                        <option value={tag}>{tag.name}</option>
                    {/each}
                </select>
                <div class="d-flex flex-row flex-wrap gap-2 my-3">
                    {#each doc.tags as tag}
                        <j.Tag name={tag.name} color={tag.color} onRemove={() => handleTagRemove(tag)} />
                    {/each}
                </div>
            </j.RowCol>

            <hr class="text-muted" />
            <h5>Maintenance</h5>
            <j.RowCol>
                <label for="password" class="form-label small">Document</label>
                <div class="d-flex gap-2">
                    <j.Button label="Move to trash" variant="danger" loadinglabel="Deleting" icon="bi-x-lg" loading={trashing} onClick={trash} />
                    <j.Button label="Archive document" variant="primary" loadinglabel="Deleting" icon="bi-archive" loading={archiving} onClick={archive} />
                </div>
            </j.RowCol>

            {@render actionButtons()}
        </j.Card>
    </div>

    <!-- PREVIEW -->
    <div class="tab-pane {activeTab === 'preview' ? 'active' : 'd-none'}">
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
                            <PdfViewer src={file} onLoaded={handleOnloaded} />
                        </div>
                    {/if}
                </j.Col>
                <j.Col></j.Col>
            </j.Row>
        </div>

        {@render actionButtons()}
    </div>
</div>

{#snippet actionButtons()}
    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/dex/dms/documents${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
{/snippet}
