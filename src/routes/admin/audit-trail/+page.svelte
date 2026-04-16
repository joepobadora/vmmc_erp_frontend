<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

    let loadingData = $state('false');
    let logs = $state([]);

    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const p = new App.ParamBuilder(page.url.searchParams);

    let tablePage = $state(p.get('page') || 1);

    let filter = $state({
        start_date: p.get('start_date') || App.Format.date(firstDayOfMonth).toISODate(),
        end_date: p.get('end_date') || App.Format.date(today).toISODate(),
        search: p.get('search') || null,
    });

    // react to changes and update params
    $effect(() => {
        p.set('page', tablePage).set('start_date', filter.start_date).set('end_date', filter.end_date).set('search', filter.search);
    });

    // debounce and react to filter
    $effect(() => {
        filter.start_date;
        filter.end_date;
        filter.search;

        const timer = setTimeout(() => {
            refreshTable();
        }, 300);

        return () => clearTimeout(timer);
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.post('/admin/audit-logs', {
                filter: filter,
            });

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

    function resetFilter() {
        filter = {
            start_date: App.Format.date(firstDayOfMonth).toISODate(),
            end_date: App.Format.date(today).toISODate(),
            search: null,
        };
        tablePage = 1;
    }
</script>

<j.RowCol>
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small active">Audit Trail</li>
        </ol>
    </nav>
</j.RowCol>

<j.Row endy>
    <!-- date from -->
    <j.Col auto>
        <label for="docmngtMyDocumentsFromDatePicker" class="small text-muted ms-1">Date from</label>
        <input bind:value={filter.start_date} type="date" class="form-control form-control-sm" id="docmngtMyDocumentsFromDatePicker" placeholder="YYYY-MM-DD" />
    </j.Col>

    <!-- date to -->
    <j.Col auto>
        <label for="docmngtMyDocumentsToDatePicker" class="small text-muted ms-1">Date to</label>
        <input bind:value={filter.end_date} type="date" class="form-control form-control-sm" id="docmngtMyDocumentsToDatePicker" placeholder="YYYY-MM-DD" />
    </j.Col>

    <!-- search -->
    <j.Col>
        <j.Row mb="0">
            <j.Col>
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
            </j.Col>
            <j.Col auto>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="checkDefault" />
                    <label class="form-check-label small text-muted" for="checkDefault">Advanced search</label>
                    <i title="This will include changed database 'values' in your query." class="bi bi-question-circle-fill ms-1 text-primary"></i>
                </div>
            </j.Col>
        </j.Row>
        <input bind:value={filter.search} type="text" class="form-control form-control-sm" placeholder="Search by name..." id="docmngtMyDocumentsSearchInput" />
    </j.Col>

    <!-- reset button -->
    <j.Col auto>
        <button onclick={resetFilter} type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
    </j.Col>
</j.Row>

<j.Card>
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
                                goto(page.url.pathname + `/view/${item.id}${p.toString()}`);
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
</j.Card>
