<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import z from 'zod';
    import Auth from '$lib/components/Auth.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { permissions } from '$lib/stores/access';

    let authSave = $state();
    let authTrash = $state();

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let doc = $state(data.document);
    let tag = $state(null);
    let reviewer = $state(null);
    let approver = $state(null);
    let changelog = $state('');

    let typeList = $state(data.typeList ?? []);
    let tagList = $state(data.tagList ?? []);
    let accountList = $state(data.accountList ?? []);

    let activeTab = $state('overview');

    let saving = $state(false);
    let trashing = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z.object({
        type: z
            .string()
            .nonempty('Required.')
            .refine((val) => typeList.map((t) => t.name).includes(val), {
                message: 'Invalid document type selected.',
            }),
        name: z.string().nonempty('Required.'),
        reviewers: z.array(z.any()).nonempty('At lease one reviewer is required.'),
        approvers: z.array(z.any()).nonempty('At lease one approver is required.'),
        changelog: z.string().nonempty('Required.'),
    });

    const reviewerSchema = z.object({
        reviewer: z.refine((val) => accountList.map((a) => a.id).includes(val), {
            message: 'Invalid reviewer selected.',
        }),
    });

    const approverSchema = z.object({
        approver: z.refine((val) => accountList.map((a) => a.id).includes(val), {
            message: 'Invalid approver selected.',
        }),
    });

    async function save() {
        const validate = schema.safeParse({
            type: doc.latest_version.document_type.name,
            name: doc.latest_version.name,
            reviewers: doc.workflow.reviewers,
            approvers: doc.workflow.approvers,
            changelog,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        // saving account
        try {
            // password auth
            if (!(await authSave.confirm())) return;

            // udpate button state
            saving = true;

            const result = await App.API.post(`/dex/dms/drafts/update/${page.params.id}`, {
                source: doc.latest_version.source_code,
                file: doc.latest_version.file,
                state: doc.state,
                type: doc.latest_version.document_type.name,
                name: doc.latest_version.name,
                details: doc.latest_version.details,
                tags: JSON.stringify(doc.tags),
                reviewers: JSON.stringify(doc.workflow.reviewers),
                approvers: JSON.stringify(doc.workflow.approvers),
                change_log: changelog,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
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
            trashing = true;

            const result = await App.API.post(`/dex/dms/drafts/trash/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
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
            trashing = false;
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

    function handleReviewerSelect() {
        const opt = [...document.querySelectorAll('#accountList option')].find((o) => o.value === reviewer);

        if (opt) {
            reviewer = Number(opt.dataset.id);
        }

        const obj = accountList.find((a) => a.id === reviewer);

        const validate = reviewerSchema.safeParse({
            reviewer,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        if (!doc.workflow.reviewers.includes(obj)) {
            doc.workflow.reviewers = [...doc.workflow.reviewers, obj];
        }

        reviewer = null;
    }

    function handleReviewerRemove(reviewer) {
        doc.workflow.reviewers = doc.workflow.reviewers.filter((r) => r !== reviewer);
    }

    function handleApproverSelect() {
        const opt = [...document.querySelectorAll('#accountList option')].find((o) => o.value === approver);

        if (opt) {
            approver = Number(opt.dataset.id);
        }

        const obj = accountList.find((a) => a.id === approver);

        const validate = approverSchema.safeParse({
            approver,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        if (!doc.workflow.approvers.includes(obj)) {
            doc.workflow.approvers = [...doc.workflow.approvers, obj];
        }

        approver = null;
    }

    function handleApproverRemove(approver) {
        doc.workflow.approvers = doc.workflow.approvers.filter((a) => a !== approver);
    }
</script>

<Auth bind:me={authSave} warning="You are about to update a draft document." />
<Auth bind:me={authTrash} warning="You are about to move the draft document to the trash." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
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
                <h5>Edit draft document</h5>
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
                    <label for="office" class="form-label small">Document Type<span class="ms-1 text-danger">*</span></label>
                    <input
                        bind:value={doc.latest_version.document_type.name}
                        list="typeList"
                        type="text"
                        class="form-control form-control-sm {errors.type ? 'is-invalid' : ''}"
                        id="office"
                        placeholder="Type and choose..."
                    />
                    <p class="text-danger small mb-auto {errors.type ? '' : 'd-none'}">{errors.type?.[0]}</p>
                    <datalist id="typeList">
                        {#each typeList as type}
                            <option value={type.name}></option>
                        {/each}
                    </datalist>
                </j.Col>
            </j.Row>
            <j.RowCol>
                <label for="password" class="form-label small">Name<span class="ms-1 text-danger">*</span></label>
                <input bind:value={doc.latest_version.name} type="text" class="form-control form-control-sm" id="password" placeholder="Name" />
            </j.RowCol>
            <j.RowCol>
                <label for="exampleFormControlTextarea1" class="form-label small">Details</label>
                <textarea bind:value={doc.latest_version.details} class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="5"></textarea>
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
            <j.Row>
                <j.Col span="4">
                    <label for="office" class="form-label small">Reviewers<span class="ms-1 text-danger">*</span></label>
                    <div class="input-group input-group-sm">
                        <input
                            bind:value={reviewer}
                            list="accountList"
                            type="text"
                            class="form-control form-control-sm {errors.reviewer || errors.reviewers ? 'is-invalid' : ''}"
                            id="office"
                            placeholder="Type and choose..."
                        />
                        <button onclick={handleReviewerSelect} class="btn btn-light border" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
                    </div>
                    <p class="text-danger small mb-auto {errors.reviewer ? '' : 'd-none'}">{errors.reviewer?.[0]}</p>
                    <p class="text-danger small mb-auto {errors.reviewers ? '' : 'd-none'}">{errors.reviewers?.[0]}</p>
                    <div class="d-flex flex-row flex-wrap gap-2 my-3">
                        {#each doc.workflow.reviewers as reviewer}
                            <j.Tag name={reviewer.user.full_name_2} onRemove={() => handleReviewerRemove(reviewer)} border />
                        {/each}
                    </div>
                </j.Col>
                <j.Col span="4">
                    <label for="office" class="form-label small">Approvers<span class="ms-1 text-danger">*</span></label>
                    <div class="input-group input-group-sm">
                        <input
                            bind:value={approver}
                            list="accountList"
                            type="text"
                            class="form-control form-control-sm {errors.approver || errors.approvers ? 'is-invalid' : ''}"
                            id="office"
                            placeholder="Type and choose..."
                        />
                        <button onclick={handleApproverSelect} class="btn btn-light border" type="button" id="button-addon2"><i class="bi bi-plus"></i></button>
                    </div>
                    <p class="text-danger small mb-auto {errors.approver ? '' : 'd-none'}">{errors.approver?.[0]}</p>
                    <p class="text-danger small mb-auto {errors.approvers ? '' : 'd-none'}">{errors.approvers?.[0]}</p>
                    <div class="d-flex flex-row flex-wrap gap-2 my-3">
                        {#each doc.workflow.approvers as approver}
                            <j.Tag name={approver.user.full_name_2} onRemove={() => handleApproverRemove(approver)} border />
                        {/each}
                    </div>
                </j.Col>

                <datalist id="accountList">
                    {#each accountList as account}
                        <option data-id={account.id} value={account.user.full_name_2}></option>
                    {/each}
                </datalist>
            </j.Row>

            <j.RowCol>
                <label for="changelog" class="form-label small">Changelog<span class="ms-1 text-danger">*</span></label>
                <textarea bind:value={changelog} class="form-control form-control-sm {errors.changelog ? 'is-invalid' : ''}" id="changelog" rows="3"></textarea>
                <p class="text-danger small mb-auto {errors.changelog ? '' : 'd-none'}">{errors.changelog?.[0]}</p>
                <span class="small text-muted fst-italic">Describe what changed and the reason behind it.</span>
            </j.RowCol>

            <hr class="text-muted" />
            <h5>Maintenance</h5>
            <j.RowCol>
                <label for="password" class="form-label small">Draft Document</label>
                <div>
                    {#if $permissions.includes('DMS.DRAFTS_DELETE')}
                        <j.Button label="Move to trash" variant="danger" loadinglabel="Deleting" icon="bi-x-lg" loading={trashing} onClick={trash} />
                    {/if}
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
                    goto(`/dex/dms/drafts${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
{/snippet}
