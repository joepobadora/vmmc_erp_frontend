<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let loadingData = $state('false');
    let roles = $state([]);

    let tablePage = $state(page.url.searchParams.get('page') || 1);

    onMount(() => {
        refreshTable();
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.get('/admin/roles');

            const data = result.data.data;

            if (result.data.success) {
                roles = data;
            } else {
                Alert.show('error', 'Request failed.', result.data.error_code);
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
                        <li class="breadcrumb-item small active">Roles</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><a class="btn btn-primary btn-sm px-3" href={page.url.pathname + `/add?page=${tablePage}`}><i class="bi bi-plus-lg me-2"></i>Add</a></div>
        </div>

        <div class="row mb-4">
            <!-- search -->
            <div class="col">
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                <input type="text" class="form-control form-control-sm" placeholder="Search by name..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- status -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Status</label>
                <select class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                    <option value="All" selected>All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
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
                    <Table data={roles} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
                        <div slot="row" let:item class="row border-bottom custom-row small">
                            <div class="col">
                                <div>
                                    <span class="text-muted me-2">Name:</span>
                                    <strong
                                        class="custom-link"
                                        onclick={() => {
                                            goto(page.url.pathname + `/view/${item.id}?page=${tablePage}`);
                                        }}>{item.name}</strong
                                    >
                                </div>
                                <div>
                                    <span class="text-muted me-2">Code:</span>
                                    <span>{item.code}</span>
                                </div>
                                <div>
                                    <span
                                        class="text-info custom-link"
                                        onclick={() => {
                                            goto(page.url.pathname + `/edit/${item.id}?page=${tablePage}`);
                                        }}>Edit</span
                                    >
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <span class="text-muted me-2">Status:</span>
                                    <span class="badge bg-{item.is_active == true ? 'success' : 'danger'}">{item.is_active == true ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                    </Table>
                {/if}
            </div>
        </div>
    </div>
</div>
