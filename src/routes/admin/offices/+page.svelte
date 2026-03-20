<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

    let loadingData = $state('false');
    let offices = $state([]);

    const p = new App.ParamBuilder(page.url.searchParams);

    let tablePage = $state(p.get('page') || 1);

    let filter = $state({
        search: p.get('search') || null,
        status: Boolean(p.get('status')) || null,
    });

    // react to changes and update params
    $effect(() => {
        p.set('page', tablePage).set('search', filter.search).set('office', filter.office).set('status', filter.status).set('role', filter.role);
    });

    // debounce and react to filter
    $effect(() => {
        filter.search;
        filter.status;

        const timer = setTimeout(() => {
            refreshTable();
        }, 300);

        return () => clearTimeout(timer);
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.post('/admin/offices', {
                filter: filter,
            });

            const data = result.data.data;

            if (result.data.success) {
                offices = data;
            } else {
                Alert.show('error', 'Request failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            loadingData = false;
        }
    }

    function resetFilter() {
        filter = {
            search: null,
            status: null,
        };
        tablePage = 1;
    }
</script>

<j.Row>
    <j.Col>
        <nav style="--bs-breadcrumb-divider: '>';">
            <ol class="breadcrumb">
                <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                <li class="breadcrumb-item small active">Offices</li>
            </ol>
        </nav>
    </j.Col>
    <j.Col auto>
        <a class="btn btn-primary btn-sm px-3" href={page.url.pathname + `/add${p.toString()}`}><i class="bi bi-plus-lg me-2"></i>Add</a>
    </j.Col>
</j.Row>
<j.Row endy>
    <j.Col>
        <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
        <input bind:value={filter.search} type="text" class="form-control form-control-sm" placeholder="Search by name or abbreviation..." id="docmngtMyDocumentsSearchInput" />
    </j.Col>
    <j.Col auto>
        <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Status</label>
        <select bind:value={filter.status} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
            <option value={null} selected>All</option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
        </select>
    </j.Col>
    <j.Col auto>
        <button type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton" onclick={resetFilter}>Reset</button>
    </j.Col>
</j.Row>
<j.Card>
    {#if loadingData}
        <div class="d-flex justify-content-center p-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    {:else}
        <Table data={offices} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
            <div slot="row" let:item class="row border-bottom custom-row small">
                <div class="col">
                    <div>
                        <span class="text-muted me-2">Office:</span>
                        <strong
                            class="custom-link"
                            onclick={() => {
                                goto(page.url.pathname + `/view/${item.id}${p.toString()}`);
                            }}>{item.short_name}</strong
                        >
                    </div>
                    <div>
                        <span
                            class="text-info custom-link"
                            onclick={() => {
                                goto(page.url.pathname + `/edit/${item.id}${p.toString()}`);
                            }}>Edit</span
                        >
                    </div>
                </div>
                <div class="col">
                    <div>
                        <span class="text-muted me-2">Status:</span>
                        <span class="badge bg-{item.is_active == 1 ? 'success' : 'danger'}">{item.is_active == 1 ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>
            </div>
        </Table>
    {/if}
</j.Card>
