<script>
    import { page } from '$app/stores';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import Table from '$lib/components/Table.svelte';
    import { onMount } from 'svelte';

    let keyword = $state('');
    let status = $state('All');

    let promise = $state();
    let timer;

    onMount(() => {
        promise = App.API.post('http://127.0.0.1:8000/api/offices', { keyword, status }, false);
    });

    function refreshTable() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            promise = App.API.post('http://127.0.0.1:8000/api/offices', { keyword, status }, false);
        }, 400);
    }

    function resetFilter() {
        keyword = '';
        status = 'All';

        refreshTable();
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
                        <li class="breadcrumb-item active">Offices</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><a class="btn btn-primary btn-sm px-3" href={$page.url.pathname + '/add'}><i class="bi bi-plus-lg me-2"></i>Add</a></div>
        </div>
        <div class="row mb-4">
            <!-- search -->
            <div class="col">
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                <input
                    bind:value={keyword}
                    onkeyup={() => refreshTable(event)}
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Search by name or abbreviation..."
                    id="docmngtMyDocumentsSearchInput"
                />
            </div>

            <!-- status -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Status</label>
                <select bind:value={status} onchange={() => refreshTable(event)} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                    <option value="All" selected>All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <!-- reset button -->
            <div class="col-auto d-flex align-items-end">
                <button onclick={resetFilter} type="button" class="btn btn-outline-secondary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
            </div>
        </div>

        <!-- table -->
        <div class="card border-0 shadow-sm px-3">
            <div class="card-body">
                {#await promise}
                    <div class="d-flex justify-content-center p-4">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>
                {:then result}
                    {#if result}
                        {#if result.success}
                            <Table data={result.data} enableTotalCount enablePagination pageSize="10">
                                <div slot="row" let:item class="row border-bottom custom-row small">
                                    <div class="col">
                                        <div>
                                            <span class="text-muted me-2">Office:</span>
                                            <strong class="custom-link">{item.short_name}</strong>
                                        </div>
                                        <div>
                                            <span class="text-muted me-2">Status:</span>
                                            <span class="badge bg-{item.is_active == 1 ? 'success' : 'danger'}">{item.is_active == 1 ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <button
                                            class="btn btn-sm btn-outline-primary px-3"
                                            onclick={() => {
                                                test(item.complete_name);
                                            }}>Edit</button
                                        >
                                    </div>
                                </div>
                            </Table>
                        {/if}
                    {/if}
                {/await}
            </div>
        </div>
    </div>
</div>
