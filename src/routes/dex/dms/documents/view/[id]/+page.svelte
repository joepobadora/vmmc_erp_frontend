<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    import DocumentStateIndicator from '../../../../components/DocumentStateIndicator.svelte';
    import DocumentLifecycleIndicator from '../../../../components/DocumentLifecycleIndicator.svelte';

    let authPost = $state();
    let authReview = $state();
    let authApprove = $state();
    let authDecline = $state();

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let documentNo = $state(data.document.document_no);
    let currentStateCode = $state(data.document.state.state.code);
    let variant = $state(data.document.state.is_original);
    let type = $state(data.document.latest_version.document_type.name);
    let name = $state(data.document.latest_version.name);
    let details = $state(data.document.latest_version.details);
    let tags = $state(data.document.tags);
    let reviewers = $state(data.document.actorProgress.reviewers);
    let approvers = $state(data.document.actorProgress.approvers);
    let versions = $state(data.document.versions);
    let lifecycles = $state(data.document.lifecycles);

    let activeTab = $state('overview');

    let posting = $state(false);
    let reviewing = $state(false);
    let approving = $state(false);
    let declining = $state(false);

    let checked = 'text-success bi-check-circle-fill';
    let unchecked = 'text-secondary bi-check-circle';

    function selectTab(tab) {
        activeTab = tab;
    }

    const p = new App.ParamBuilder(page.url.searchParams);

    async function post() {
        try {
            // password auth
            if (!(await authPost.confirm())) return;

            // udpate button state
            posting = true;

            const result = await App.API.post(`/dex/dms/drafts/post/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                    Alert.show('success', 'Posting success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Posting failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            posting = false;
        }
    }

    async function review() {
        try {
            // password auth
            if (!(await authReview.confirm())) return;

            // udpate button state
            reviewing = true;

            const result = await App.API.post(`/dex/dms/drafts/review/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                    Alert.show('success', 'Reviewing success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Reviewing failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            reviewing = false;
        }
    }

    async function approve() {
        try {
            // password auth
            if (!(await authApprove.confirm())) return;

            // udpate button state
            approving = true;

            const result = await App.API.post(`/dex/dms/drafts/approve/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                    Alert.show('success', 'Approving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Approving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            approving = false;
        }
    }

    async function decline() {
        try {
            // password auth
            if (!(await authDecline.confirm())) return;

            // udpate button state
            declining = true;

            const result = await App.API.post(`/dex/dms/drafts/decline/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                    Alert.show('success', 'Declining success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Declining failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            declining = false;
        }
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
</script>

<Auth bind:me={authPost} warning="You are about to post a draft document." />
<Auth bind:me={authReview} warning="You are about to review a posted document." />
<Auth bind:me={authApprove} warning="You are about to approve a posted document." />
<Auth bind:me={authDecline} warning="You are about to decline a document." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dms/drafts{p.toString()}">(Document Manager) Drafts</a></li>
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
            <j.Row>
                <j.Col>
                    <h5>{name}</h5>
                    <span class="small text-muted">{documentNo}</span>
                </j.Col>
                <j.Col auto>
                    <span class="badge bg-{variant == true ? 'primary' : 'secondary'}">{variant == true ? 'Original' : 'Reference Copy'}</span>
                </j.Col>
            </j.Row>
            <j.RowCol>
                <DocumentStateIndicator currentState={currentStateCode} />
            </j.RowCol>
            <hr class="text-muted" />
            <j.Row>
                <j.Col span="6">
                    <label for="office" class="form-label small">Document Type</label>
                    <input bind:value={type} class="form-control form-control-sm" id="office" disabled />
                </j.Col>
            </j.Row>
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
                    {#each reviewers as reviewer}
                        <div class="small"><i class="bi {reviewer.acted == true ? checked : unchecked} me-2"></i>{reviewer.account.user.full_name_2}</div>
                    {/each}
                </j.Col>
                <j.Col span="4">
                    <label for="exampleFormControlTextarea1" class="form-label small">Approvers</label>
                    {#each approvers as approver}
                        <div class="small"><i class="bi {approver.acted == true ? checked : unchecked} me-2"></i>{approver.account.user.full_name_2}</div>
                    {/each}
                </j.Col>
            </j.Row>
            {@render actionButtons()}
        </j.Card>
    </div>

    <!-- HISTORY -->
    <div class="tab-pane {activeTab === 'history' ? 'active' : 'd-none'}">
        <j.Card>
            <j.Row>
                <j.Col>
                    <h5>Versions</h5>
                    <j.Row>
                        <j.Col span="2">
                            <span class="text-muted small">No</span>
                        </j.Col>
                        <j.Col>
                            <span class="text-muted small">Changelog</span>
                        </j.Col>
                        <j.Col>
                            <span class="text-muted small">Timestamp</span>
                        </j.Col>
                    </j.Row>
                    {#each versions as version, i}
                        <div class="text-muted small">
                            <j.Row>
                                <j.Col span="2">
                                    <span class="{i === 0 ? 'text-primary' : ''} fw-semibold">{version.version_no}</span>
                                </j.Col>
                                <j.Col>
                                    <span class={i === 0 ? 'text-primary' : ''}>{version.change_log}</span>
                                </j.Col>
                                <j.Col>
                                    <span class={i === 0 ? 'text-primary' : ''}>{App.Format.date(version.created_at).toDatetime()}</span>
                                </j.Col>
                            </j.Row>
                        </div>
                        <hr class="text-muted" />
                    {/each}
                </j.Col>

                <j.Col auto>
                    <h5>Lifecycle</h5>
                    <j.RowCol>
                        <DocumentLifecycleIndicator {lifecycles} />
                    </j.RowCol>
                </j.Col>
            </j.Row>

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
            <!-- document is in draft -->
            {#if data.docTransitions.includes('DOCSTATE2')}
                <j.Button label="Post" loadinglabel="Posting" icon="bi-arrow-right" loading={posting} onClick={post} />
            {/if}

            <!-- document is in review and user is permitted to do so -->
            {#if data.docTransitions.includes('DOCSTATE5') && data.userTransitions.includes('DOCSTATE5') && data.userAction.asReviewer.acted == false}
                <j.Button label="Decline" loadinglabel="Declining" variant="danger" icon="bi-x-lg" loading={reviewing} onClick={decline} />
                <j.Button label="Review" loadinglabel="Reviewing" icon="bi-check-lg" loading={reviewing} onClick={review} />
            {/if}

            <!-- document is in approval and user is permitted to do so -->
            {#if data.docTransitions.includes('DOCSTATE6') && data.userTransitions.includes('DOCSTATE6') && data.userAction.asApprover.acted == false}
                <j.Button label="Decline" loadinglabel="Declining" variant="danger" icon="bi-x-lg" loading={reviewing} onClick={decline} />
                <j.Button label="Approve" loadinglabel="Approving" icon="bi-arrow-right" loading={approving} onClick={approve} />
            {/if}
            <button
                type="button"
                class="btn btn-primary btn-sm px-3"
                onclick={() => {
                    goto(`/dex/dms/drafts${p.toString()}`);
                }}>Okay</button
            >
        </div>
    </j.RowCol>
{/snippet}
