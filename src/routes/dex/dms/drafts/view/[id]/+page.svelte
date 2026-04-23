<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let documentNo = $state(data.document.document_no);
    let currentState = $state(data.document.state.state.enumeration);
    let variant = $state(data.document.state.is_original);
    let type = $state(data.document.latest_version.document_type.name);
    let name = $state(data.document.latest_version.name);
    let details = $state(data.document.latest_version.details);
    let tags = $state(data.document.tags);
    let reviewers = $state(data.document.latest_version.workflow.reviewers);
    let approvers = $state(data.document.latest_version.workflow.approvers);
    let signatories = $state(data.document.latest_version.workflow.signatories);
    let currentVersion = $state(data.document.latest_version.version_no);
    let versionDate = $state(App.Format.date(data.document.latest_version.created_at).toFullMonthDate());
    let changeLog = $state(data.document.latest_version.change_log);
    let lifecycles = $state(data.document.lifecycles);

    let activeTab = $state('overview');

    function selectTab(tab) {
        activeTab = tab;
    }

    const p = new App.ParamBuilder(page.url.searchParams);

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
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dms/drafts">(Document Manager) Drafts</a></li>
            <li class="breadcrumb-item active">View</li>
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
                class="nav-link {activeTab === 'history' ? 'active' : ''}"
                href=""
                onclick={(e) => {
                    e.preventDefault();
                    selectTab('history');
                }}
            >
                History
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
                <h5>View draft document</h5>
                <p class="small text-muted">
                    A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                </p>
            </j.RowCol>
            <hr class="text-muted" />
            <h5>Document</h5>
            <j.Row>
                <j.Col span="6">
                    <label for="username" class="form-label small">Document No.</label>
                    <input bind:value={documentNo} class="form-control form-control-sm" id="username" disabled />
                </j.Col>
                <j.Col span="3">
                    <label for="username" class="form-label small">Current State</label>
                    <input bind:value={currentState} class="form-control form-control-sm" id="username" disabled />
                </j.Col>
                <j.Col span="3">
                    <label for="username" class="form-label small">Variant</label>
                    <div>
                        <span class="badge bg-{variant == true ? 'primary' : 'secondary'}">{variant == true ? 'Original' : 'Reference Copy'}</span>
                    </div>
                </j.Col>
            </j.Row>
            <j.Row>
                <j.Col span="6">
                    <label for="office" class="form-label small">Document Type</label>
                    <input bind:value={type} class="form-control form-control-sm" id="office" disabled />
                </j.Col>
            </j.Row>
            <j.RowCol>
                <label for="password" class="form-label small">Name</label>
                <input bind:value={name} type="text" class="form-control form-control-sm" id="password" placeholder="Name" disabled />
            </j.RowCol>
            <j.RowCol>
                <label for="exampleFormControlTextarea1" class="form-label small">Details</label>
                <textarea bind:value={details} class="form-control form-control-sm" id="exampleFormControlTextarea1" rows="5" disabled></textarea>
            </j.RowCol>
            <j.RowCol span="6">
                <label for="exampleFormControlTextarea1" class="form-label small">Tags</label>
                <div class="d-flex flex-row flex-wrap gap-2 my-3">
                    {#each tags as tag}
                        <j.Tag name={tag.name} color={tag.color} noremove />
                    {/each}
                </div>
            </j.RowCol>
            <j.Row>
                <j.Col span="4">
                    <label for="exampleFormControlTextarea1" class="form-label small">Reviewers</label>
                    <div class="d-flex flex-row flex-wrap gap-2 my-3">
                        {#each reviewers as reviewer}
                            <j.Tag name={reviewer.user.full_name_2} border />
                        {/each}
                    </div>
                </j.Col>
                <j.Col span="4">
                    <label for="exampleFormControlTextarea1" class="form-label small">Approvers</label>
                    <div class="d-flex flex-row flex-wrap gap-2 my-3">
                        {#each approvers as approver}
                            <j.Tag name={approver.user.full_name_2} border />
                        {/each}
                    </div>
                </j.Col>
                <j.Col span="4">
                    <label for="exampleFormControlTextarea1" class="form-label small">Signatories</label>
                    <div class="d-flex flex-row flex-wrap gap-2 my-3">
                        {#each signatories as signatory}
                            <j.Tag name={signatory.user.full_name_2} border />
                        {/each}
                    </div>
                </j.Col>
            </j.Row>

            <j.RowCol endx>
                <button
                    type="button"
                    class="btn btn-primary btn-sm px-3"
                    onclick={() => {
                        goto(`/dex/dms/drafts${p.toString()}`);
                    }}>Okay</button
                >
            </j.RowCol>
        </j.Card>
    </div>

    <!-- HISTORY -->
    <div class="tab-pane {activeTab === 'history' ? 'active' : 'd-none'}">
        <j.Card>
            <h5>Version</h5>
            <j.Row>
                <j.Col span="6">
                    <label for="username" class="form-label small">Current Version</label>
                    <input bind:value={currentVersion} class="form-control form-control-sm" id="username" disabled />
                </j.Col>
                <j.Col span="3">
                    <label for="username" class="form-label small">Date Created</label>
                    <input bind:value={versionDate} class="form-control form-control-sm" id="username" disabled />
                </j.Col>
            </j.Row>
            <j.Row>
                <j.Col>
                    <label for="office" class="form-label small">What's changed?</label>
                    <input bind:value={changeLog} class="form-control form-control-sm" id="office" disabled />
                </j.Col>
            </j.Row>

            <hr class="text-muted" />
            <h5>Lifecycle</h5>

            <j.RowCol>
                <div class="position-relative ms-2 mt-4">
                    <!-- Vertical line -->
                    <div class="position-absolute top-0 bottom-0 start-0 bg-primary-subtle" style="width:1px;"></div>

                    {#each lifecycles as lifecycle, index}
                        <!-- Timeline item -->
                        <div class="mb-3 position-relative">
                            <!-- Dot -->
                            <div class="position-absolute start-0 translate-middle rounded-circle {index === 0 ? 'bg-primary' : 'bg-secondary-subtle'}" style="width:14px; height:14px;"></div>
                            <!-- Content -->
                            <div class="ms-4 px-3 py-2 border bg-light">
                                <j.RowCol mb="0">
                                    <j.Row mb="0">
                                        <j.Col auto>
                                            <span class="small">Date: </span>
                                        </j.Col>
                                        <j.Col>
                                            <span class="small text-danger">{App.Format.date(lifecycle.created_at).toDatetime()}</span>
                                        </j.Col>
                                        <j.Col auto>
                                            <span class="small">State: </span>
                                        </j.Col>
                                        <j.Col auto>
                                            <span class="small">{lifecycle.state.enumeration}</span>
                                        </j.Col>
                                    </j.Row>

                                    <j.Row mb="0">
                                        <j.Col auto>
                                            <span class="small">Variant: </span>
                                        </j.Col>
                                        <j.Col>
                                            <span class="badge bg-{lifecycle.is_original == true ? 'primary' : 'secondary'}">{lifecycle.is_original == true ? 'Original' : 'Reference Copy'}</span>
                                        </j.Col>
                                        <j.Col auto>
                                            <span class="small">Version: </span>
                                        </j.Col>
                                        <j.Col auto>
                                            <span class="small">{lifecycle.version.version_no}</span>
                                        </j.Col>
                                    </j.Row>

                                    <j.Row mb="0">
                                        <j.Col auto>
                                            <span class="small">Office: </span>
                                        </j.Col>
                                        <j.Col auto>
                                            <span class="small">{lifecycle.office.short_name}</span>
                                        </j.Col>
                                    </j.Row>
                                </j.RowCol>
                            </div>
                        </div>
                    {/each}
                </div>
            </j.RowCol>

            <j.RowCol endx>
                <button
                    type="button"
                    class="btn btn-primary btn-sm px-3"
                    onclick={() => {
                        goto(`/dex/dms/drafts${p.toString()}`);
                    }}>Okay</button
                >
            </j.RowCol>
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

        <j.RowCol endx>
            <button
                type="button"
                class="btn btn-primary btn-sm px-3"
                onclick={() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                }}>Okay</button
            >
        </j.RowCol>
    </div>
</div>
