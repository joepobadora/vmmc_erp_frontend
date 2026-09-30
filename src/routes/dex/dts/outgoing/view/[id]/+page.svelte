<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    import TransactionTrailIndicator from '../../../../components/TransactionTrailIndicator.svelte';

    let authRecall = $state();

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

    let recalling = $state(false);

    function selectTab(tab) {
        activeTab = tab;
    }

    const p = new App.ParamBuilder(page.url.searchParams);

    async function recall() {
        try {
            // password auth
            if (!(await authRecall.confirm())) return;

            // udpate button state
            recalling = true;

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
            recalling = false;
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
            const result = await App.API.post('/dex/dts/outgoing/view/file', { id: data.transaction.document.latest_version.file.id }, { responseType: 'blob' });

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

<Auth bind:me={authRecall} warning="You are about to recall a transaction." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';" class="small">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item"><a href="/dex/dts/outgoing{p.toString()}">(Document Manager) Drafts</a></li>
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
            <!-- document is in released or forwarded -->
            {#if data.TranTransitions.includes('ACTION4') || data.TranTransitions.includes('ACTION5')}
                <j.Button label="Recall" loadinglabel="Recalling" icon="bi-arrow-right" loading={recalling} onClick={recall} />
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
