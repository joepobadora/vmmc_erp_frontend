<script>
    import { page } from '$app/stores';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    let loadingData = $state('false');
    let accounts = $state([]);

    onMount(() => {
        refreshTable();
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.get('/admin/accounts');

            if (result.success) {
                accounts = result.data;
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
                        <li class="breadcrumb-item"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item active">Accounts</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><a class="btn btn-primary btn-sm px-3" href={$page.url.pathname + '/create'}><i class="bi bi-plus-lg me-2"></i>Create</a></div>
        </div>

        <div class="row mb-4">
            <!-- search -->
            <div class="col">
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                <input type="text" class="form-control form-control-sm" placeholder="Search by name or username..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- office -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsDocumentTypeSelect" class="small text-muted ms-1">Office</label>
                <input list="adminUsersDepartmentSelectList" class="form-control form-control-sm" placeholder="Type and choose..." id="docmngtMyDocumentsDocumentTypeSelect" />

                <!-- dynamic datalist of document type -->
                <datalist id="docmngtMyDocumentsDocumentTypeSelectList"></datalist>
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

            <!-- role -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Role</label>
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
                    <Table data={accounts} enableTotalCount enablePagination pageSize="10">
                        <div slot="row" let:item class="row border-bottom custom-row small">
                            <div class="col">
                                <div>
                                    <span class="text-muted me-2">Name:</span>
                                    <strong class="custom-link">{item.user.full_name}</strong>
                                </div>
                                <div>
                                    <span class="text-muted me-2">Username:</span>
                                    <span>{item.username}</span>
                                </div>
                                <div>
                                    <span class="text-muted me-2">Status:</span>
                                    <span class="badge bg-{item.is_active == true ? 'success' : 'danger'}">{item.is_active == true ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                            <div class="col">
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
                                    <span>{item.creator.user.full_name}</span>
                                </div>
                            </div>
                            <div class="col-auto">
                                <button
                                    class="btn btn-sm btn-outline-primary px-3"
                                    onclick={() => {
                                        test(item.user.full_name);
                                    }}>Edit</button
                                >
                            </div>
                        </div>
                    </Table>
                {/if}
            </div>
        </div>
    </div>
</div>
