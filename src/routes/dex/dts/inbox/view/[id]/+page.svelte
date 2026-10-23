<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';
    import DirectForwardPrompt from '../../../../components/DirectForwardPrompt.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { permissions } from '$lib/stores/access';

    import TransactionTrailIndicator from '../../../../components/TransactionTrailIndicator.svelte';

    let authRetrieve = $state();
    let authForward = $state();
    let authRelease = $state();
    let authTerminate = $state();
    let authArchive = $state();
    let authCopy = $state();

    let directForwardPrompt = $state(null);

    let { data } = $props();

    let file = $state(null);
    let loadingDocumentFile = $state(false);
    let pdfData = $state(null);

    let transactionNo = $state(data.transaction.transaction_no);
    let documentNo = $state(data.transaction.document.document_no);
    let type = $state(data.transaction.document.latest_version.document_type.name);
    let name = $state(data.transaction.document.latest_version.name);
    let details = $state(data.transaction.document.latest_version.details);
    let trails = $state(data.transaction.trails);

    let activeTab = $state('overview');

    let retrieving = $state(false);
    let forwarding = $state(false);
    let releasing = $state(false);
    let terminating = $state(false);
    let archiving = $state(false);
    let copying = $state(false);

    function selectTab(tab) {
        activeTab = tab;
    }

    const p = new App.ParamBuilder(page.url.searchParams);

    async function retrieve() {
        try {
            // password auth
            if (!(await authRetrieve.confirm())) return;

            // udpate button state
            retrieving = true;

            const result = await App.API.post(`/dex/dts/inbox/retrieve/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/inbox${p.toString()}`);
                    Alert.show('success', 'Retrieving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Retrieving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            retrieving = false;
        }
    }

    async function forward() {
        if (await directForwardPrompt.confirm()) {
            setTimeout(() => {
                goto(`/dex/dts/inbox${p.toString()}`);
            }, 600);
        }
    }

    async function release() {
        try {
            // password auth
            if (!(await authRelease.confirm())) return;

            // udpate button state
            releasing = true;

            const result = await App.API.post(`/dex/dts/inbox/release/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/inbox${p.toString()}`);
                    Alert.show('success', 'Releasing success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Releasing failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            releasing = false;
        }
    }

    async function terminate() {
        try {
            // password auth
            if (!(await authTerminate.confirm())) return;

            // udpate button state
            terminating = true;

            const result = await App.API.post(`/dex/dts/inbox/terminate/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/inbox${p.toString()}`);
                    Alert.show('success', 'Terminating success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Terminating failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            terminating = false;
        }
    }

    async function archive() {
        try {
            // password auth
            if (!(await authArchive.confirm())) return;

            // udpate button state
            archiving = true;

            const result = await App.API.post(`/dex/dts/inbox/archive/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/inbox${p.toString()}`);
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

    async function copy() {
        try {
            // password auth
            if (!(await authCopy.confirm())) return;

            // udpate button state
            copying = true;

            const result = await App.API.post(`/dex/dts/inbox/copy/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/inbox${p.toString()}`);
                    Alert.show('success', 'Copying success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Copying failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            copying = false;
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
            const result = await App.API.post('/dex/dts/inbox/view/file', { id: data.transaction.document.latest_version.file.id }, { responseType: 'blob' });

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

<Auth bind:me={authRetrieve} warning="You are about to retrieve a document." />
<Auth bind:me={authForward} warning="You are about to forward a transaction." />
<Auth bind:me={authRelease} warning="You are about to release a transaction." />
<Auth bind:me={authTerminate} warning="You are about to terminate a transaction." />
<Auth bind:me={authArchive} warning="You are about to archive a transaction." />
<Auth bind:me={authCopy} warning="You are about to save a copy of the document." />

<DirectForwardPrompt bind:me={directForwardPrompt} tranId={data.transaction.id} tranNo={data.transaction.transaction_no} />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dts/inbox{p.toString()}">(Tracker) Inbox</a></li>
            <li class="breadcrumb-item small active">View</li>
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
                    <span class="small text-muted">{transactionNo}</span>
                </j.Col>
            </j.Row>
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

            {@render actionButtons()}
        </j.Card>
    </div>

    <!-- HISTORY -->
    <div class="tab-pane {activeTab === 'history' ? 'active' : 'd-none'}">
        <j.Card>
            <j.Row>
                <j.Col>
                    <h5>Trails</h5>
                    <j.RowCol>
                        <TransactionTrailIndicator {trails} />
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
            // check if user has permission to save a copy of the document from a transaction
            {#if $permissions.includes('DTS.INBOX_COPY')}
                <j.Button label="Save a Copy" loadinglabel="Copying" variant="light" icon="bi-download" loading={copying} onClick={copy} />
            {/if}

            // check if user has permisison to terminate a transaction and the transaction is not terminated
            {#if $permissions.includes('DTS.INBOX_TERMINATE') && !data.tranTransitions.includes('ACTION5')}
                <j.Button label="Terminate" loadinglabel="Terminating" icon="bi-check2" loading={terminating} onClick={terminate} />
            {/if}

            // check if user has permission to retrieve a document and the transaction is terminated and the transaction has a document
            {#if $permissions.includes('DTS.INBOX_RETRIEVE') && data.tranTransitions.includes('ACTION5') && data.transaction.state.has_document}
                <j.Button label="Retrieve" loadinglabel="Retrieving" variant="light" icon="bi-download" loading={retrieving} onClick={retrieve} />
            {/if}

            // check if user has permission to archive a transaction and the transaction is terminated
            {#if $permissions.includes('DTS.INBOX_ARCHIVE') && data.tranTransitions.includes('ACTION5')}
                <j.Button label="Archive" loadinglabel="Archiving" variant="light" icon="bi-archive" loading={archiving} onClick={archive} />
            {/if}

            // check if user has permission to release a transaction and the transaction is not terminated
            {#if $permissions.includes('DTS.INBOX_RELEASE') && !data.tranTransitions.includes('ACTION5')}
                <j.Button label="Release" loadinglabel="Releasing" icon="bi-cloud-upload" loading={releasing} onClick={release} />
            {/if}

            // check if user has permission to forward a transaction and the transaction is not terminated
            {#if $permissions.includes('DTS.INBOX_FORWARD') && !data.tranTransitions.includes('ACTION5')}
                <j.Button label="Forward" loadinglabel="Forwarding" icon="bi-arrow-right-circle" loading={forwarding} onClick={forward} />
            {/if}

            <button
                type="button"
                class="btn btn-primary btn-sm px-3"
                onclick={() => {
                    goto(`/dex/dts/inbox${p.toString()}`);
                }}>Okay</button
            >
        </div>
    </j.RowCol>
{/snippet}
