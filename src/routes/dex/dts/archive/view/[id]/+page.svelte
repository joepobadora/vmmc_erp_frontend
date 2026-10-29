<script>
    import PdfViewer from '$lib/components/PDFViewer.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { permissions } from '$lib/stores/access';

    import TransactionTrailIndicator from '../../../../components/TransactionTrailIndicator.svelte';

    let authUnarchive = $state();
    let authTrash = $state();

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

    let unarchiving = $state(false);
    let trashing = $state(false);

    function selectTab(tab) {
        activeTab = tab;
    }

    const p = new App.ParamBuilder(page.url.searchParams);

    async function unarchive() {
        try {
            // password auth
            if (!(await authUnarchive.confirm())) return;

            // udpate button state
            unarchiving = true;

            const result = await App.API.post(`/dex/dts/archive/unarchive/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/archive${p.toString()}`);
                    Alert.show('success', 'Unarchiving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Unarchiving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            unarchiving = false;
        }
    }

    async function trash() {
        try {
            // password auth
            if (!(await authTrash.confirm())) return;

            // udpate button state
            trashing = true;

            const result = await App.API.post(`/dex/dts/archive/trash/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/dex/dts/archive${p.toString()}`);
                    Alert.show('success', 'Trashing success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Trashing failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            trashing = false;
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
            const result = await App.API.post('/dex/dts/archive/view/file', { id: data.transaction.document.latest_version.file.id }, { responseType: 'blob' });

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

<Auth bind:me={authUnarchive} warning="You are about to unachive a transaction." />
<Auth bind:me={authTrash} warning="You are about to move a transaction to the trash." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
            <li class="breadcrumb-item small"><a href="/dex/dts/archive{p.toString()}">(Tracker) Archive</a></li>
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
                    <h5>{name}<span class="fw-normal ms-2 text-muted fst-italic">({documentNo})</span></h5>
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
            <!-- check if user has permission to delete a transaction -->
            {#if $permissions.includes('DTS.ARCHIVE_DELETE')}
                <j.Button label="Move to Trash" loadinglabel="Trashing" variant="danger" icon="bi-x-lg" loading={trashing} onClick={trash} />
            {/if}

            <!-- check if user has permission to unarchive a transaction -->
            {#if $permissions.includes('DTS.ARCHIVE_UNARCHIVE')}
                <j.Button label="Unarchive" loadinglabel="Unarchiving" variant="light" icon="bi-download" loading={unarchiving} onClick={unarchive} />
            {/if}

            <button
                type="button"
                class="btn btn-primary btn-sm px-3"
                onclick={() => {
                    goto(`/dex/dts/incoming${p.toString()}`);
                }}>Okay</button
            >
        </div>
    </j.RowCol>
{/snippet}
