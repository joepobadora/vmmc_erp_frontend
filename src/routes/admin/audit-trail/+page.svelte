<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let loadingData = $state('false');
    let logs = $state([]);

    let tablePage = $state(page.url.searchParams.get('page') || 1);

    onMount(() => {
        refreshTable();
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.get('/admin/audit-logs');

            const data = result.data.data;

            if (result.data.success) {
                logs = data;
            } else {
                Alert.show('error', 'Request failed.', result.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            loadingData = false;
        }
    }
</script>

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item small active">Audit Trail</li>
                    </ol>
                </nav>
            </div>
        </div>

        <div class="row mb-4">
            <!-- date from -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsFromDatePicker" class="small text-muted ms-1">Date from</label>
                <input type="date" class="form-control form-control-sm" id="docmngtMyDocumentsFromDatePicker" placeholder="YYYY-MM-DD" />
            </div>

            <!-- date to -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsToDatePicker" class="small text-muted ms-1">Date to</label>
                <input type="date" class="form-control form-control-sm" id="docmngtMyDocumentsToDatePicker" placeholder="YYYY-MM-DD" />
            </div>

            <!-- search -->
            <div class="col">
                <div class="row">
                    <div class="col">
                        <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                    </div>
                    <div class="col-auto">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                            <label class="form-check-label small text-muted" for="checkDefault">Advanced search</label>
                            <i title="This will include changed database 'values' in your query." class="bi bi-question-circle-fill ms-1 text-primary"></i>
                        </div>
                    </div>
                </div>
                <input type="text" class="form-control form-control-sm" placeholder="Search by name..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- reset button -->
            <div class="col-auto d-flex align-items-end">
                <button type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
            </div>
        </div>

        <!-- table -->
        <div class="card border-0 shadow-sm px-3">
            <div class="card-body">
                {#if loadingData}
                    <div class="d-flex justify-content-center p-4">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>
                {:else}
                    <div class="row px-2">
                        <div class="col">
                            <p class="small text-muted">Timestamp</p>
                        </div>
                        <div class="col">
                            <p class="small text-muted">Client Route</p>
                        </div>
                        <div class="col">
                            <p class="small text-muted">Action Taken</p>
                        </div>
                        <div class="col">
                            <p class="small text-muted">Entity</p>
                        </div>
                        <div class="col">
                            <p class="small text-muted">Actor</p>
                        </div>
                    </div>
                    <Table data={logs} enableTotalCount enablePagination pageSize="50" bind:currentPage={tablePage}>
                        <div slot="row" let:item class="row border-bottom custom-row small">
                            <div class="col">
                                <div>
                                    <span
                                        class="custom-link text-danger"
                                        onclick={() => {
                                            goto(page.url.pathname + `/view/${item.id}?page=${tablePage}`);
                                        }}>{App.Format.date(item.created_at).toDatetime()}</span
                                    >
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <span>{item.client_route}</span>
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <span
                                        >{(() => {
                                            const id = (item.api_endpoint.match(/\/(\d+)$/) || [])[1];
                                            return item.details + (id ? ': ' + id : '');
                                        })()}</span
                                    >
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <span>{item.entity}</span>
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <span>{item.full_name_2}</span>
                                </div>
                            </div>
                        </div>
                    </Table>
                {/if}
            </div>
        </div>
    </div>
</div>
