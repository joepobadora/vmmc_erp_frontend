<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';
    import { permissions } from '$lib/stores/access';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);
    let roleList = $state(data.roleList ?? []);

    let loadingData = $state('false');
    let accounts = $state([]);

    const p = new App.ParamBuilder(page.url.searchParams);

    let tablePage = $state(p.get('page') || 1);

    let filter = $state({
        search: p.get('search') || null,
        office: p.get('office') || null,
        status: Boolean(p.get('status')) || null,
        role: Number(p.get('role')) || null,
    });

    console.log($permissions);

    // react to changes and update params
    $effect(() => {
        p.set('page', tablePage).set('search', filter.search).set('office', filter.office).set('status', filter.status).set('role', filter.role);
    });

    // debounce and react to filter
    $effect(() => {
        filter.search;
        filter.office;
        filter.status;
        filter.role;

        const timer = setTimeout(() => {
            refreshTable();
        }, 300);

        return () => clearTimeout(timer);
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.post('/admin/accounts', {
                filter: filter,
            });

            const data = result.data.data;

            if (result.data.success) {
                accounts = data;
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
            search: null,
            office: null,
            status: null,
            role: null,
        };
        tablePage = 1;
    }
</script>

<j.Row>
    <j.Col>
        <nav style="--bs-breadcrumb-divider: '>';">
            <ol class="breadcrumb">
                <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                <li class="breadcrumb-item small active">Accounts</li>
            </ol>
        </nav>
    </j.Col>
    <j.Col auto>
        <a class="btn btn-primary btn-sm px-3" href={page.url.pathname + `/create${p.toString()}`}><i class="bi bi-plus-lg me-2"></i>Create</a>
    </j.Col>
</j.Row>
<j.Row endy>
    <j.Col>
        <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
        <input bind:value={filter.search} type="text" class="form-control form-control-sm" placeholder="Search by name or username..." id="docmngtMyDocumentsSearchInput" />
    </j.Col>
    <j.Col auto>
        <label for="docmngtMyDocumentsDocumentTypeSelect" class="small text-muted ms-1">Office</label>
        <input bind:value={filter.office} list="officeList" class="form-control form-control-sm" placeholder="Type and choose..." id="docmngtMyDocumentsDocumentTypeSelect" />

        <!-- dynamic datalist of office -->
        <datalist id="officeList">
            {#each officeList as office}
                <option value={office.short_name}></option>
            {/each}
        </datalist>
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
        <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Role</label>
        <select bind:value={filter.role} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
            <option value={null}>All</option>
            {#each roleList as role}
                <option value={role.id}>{role.name}</option>
            {/each}
        </select>
    </j.Col>
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
        <Table data={accounts} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
            <div slot="row" let:item class="row border-bottom custom-row small">
                <div class="col">
                    <div>
                        <span class="text-muted me-2">Name:</span>
                        {#if $permissions.includes('ADMIN.ACC_VIEW')}
                            <strong
                                class="custom-link"
                                onclick={() => {
                                    goto(page.url.pathname + `/view/${item.id}${p.toString()}`);
                                }}
                            >
                                {item.user.full_name_2}
                            </strong>
                        {:else}
                            <strong>
                                {item.user.full_name_2}
                            </strong>
                        {/if}
                    </div>
                    <div>
                        <span class="text-muted me-2">Username:</span>
                        <span>{item.username}</span>
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
                        <span class="badge bg-{item.is_active == true ? 'success' : 'danger'}">{item.is_active == true ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div>
                        <span class="text-muted me-2">Office:</span>
                        <span>{item.office.short_name}</span>
                    </div>
                </div>
                <div class="col-auto ms-auto">
                    <div>
                        <span class="text-muted me-2">Date created:</span>
                        <span>{App.Format.date(item.created_at).toFullMonthDate()}</span>
                    </div>
                    <div>
                        <span class="text-muted me-2">By:</span>
                        <span>{item.creator.user.full_name_2}</span>
                    </div>
                </div>
            </div>
        </Table>
    {/if}
</j.Card>
