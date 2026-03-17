<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);
    let roleList = $state(data.roleList ?? []);

    let loadingData = $state('false');
    let accounts = $state([]);

    let filter = $state({
        search: null,
        office: null,
        status: null,
        role: null,
    });

    let tablePage = $state(page.url.searchParams.get('page') || 1);

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
                        <li class="breadcrumb-item small active">Accounts</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><a class="btn btn-primary btn-sm px-3" href={page.url.pathname + `/create?page=${tablePage}`}><i class="bi bi-plus-lg me-2"></i>Create</a></div>
        </div>

        <div class="row mb-4">
            <!-- search -->
            <div class="col">
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                <input bind:value={filter.search} type="text" class="form-control form-control-sm" placeholder="Search by name or username..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- office -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsDocumentTypeSelect" class="small text-muted ms-1">Office</label>
                <input bind:value={filter.office} list="officeList" class="form-control form-control-sm" placeholder="Type and choose..." id="docmngtMyDocumentsDocumentTypeSelect" />

                <!-- dynamic datalist of office -->
                <datalist id="officeList">
                    {#each officeList as office}
                        <option value={office.short_name}></option>
                    {/each}
                </datalist>
            </div>

            <!-- status -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Status</label>
                <select bind:value={filter.status} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                    <option value={null} selected>All</option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                </select>
            </div>

            <!-- role -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Role</label>
                <select bind:value={filter.role} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                    <option value={null}>All</option>
                    {#each roleList as role}
                        <option value={role.id}>{role.name}</option>
                    {/each}
                </select>
            </div>

            <!-- reset button -->
            <div class="col-auto d-flex align-items-end">
                <button onclick={resetFilter} type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
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
                    <Table data={accounts} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
                        <div slot="row" let:item class="row border-bottom custom-row small">
                            <div class="col">
                                <div>
                                    <span class="text-muted me-2">Name:</span><strong
                                        class="custom-link"
                                        onclick={() => {
                                            goto(page.url.pathname + `/view/${item.id}?page=${tablePage}`);
                                        }}>{item.user.full_name_2}</strong
                                    >
                                </div>
                                <div>
                                    <span class="text-muted me-2">Username:</span>
                                    <span>{item.username}</span>
                                </div>
                                <div>
                                <span class="text-info custom-link"
                                onclick={() => {
                                        goto(page.url.pathname + `/edit/${item.id}?page=${tablePage}`);
                                    }}
                                ><i class="bi bi-pencil-fill me-1 small"></i>Edit</span>
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
                            <!-- <div class="col-auto">
                                <button
                                    class="btn btn-sm btn-outline-primary px-3"
                                    onclick={() => {
                                        goto(page.url.pathname + `/edit/${item.id}?page=${tablePage}`);
                                    }}>Edit</button
                                >
                            </div> -->
                        </div>
                    </Table>
                {/if}
            </div>
        </div>
    </div>
</div>
