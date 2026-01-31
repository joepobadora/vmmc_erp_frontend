<script>
    import { page } from '$app/stores';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    let promise = $state();
    let timer;

    const accounts = [
        { id: 1, fullname: 'Dela Cruz, Juan', username: 'jdelacruz', office: 'Finance', status: 'Active', date_created: '2024-01-12', created_by: 'admin' },
        { id: 2, fullname: 'Santos, Maria', username: 'msantos', office: 'Human Resources', status: 'Active', date_created: '2024-02-05', created_by: 'admin' },
        { id: 3, fullname: 'Ramirez, Carlos', username: 'cramirez', office: 'IT', status: 'Inactive', date_created: '2024-03-18', created_by: 'admin' },
        { id: 4, fullname: 'Lopez, Ana', username: 'alopez', office: 'Procurement', status: 'Active', date_created: '2024-04-09', created_by: 'admin' },
        { id: 5, fullname: 'Reyes, Mark', username: 'mreyes', office: 'Engineering', status: 'Inactive', date_created: '2024-05-22', created_by: 'admin' },
        { id: 6, fullname: 'Lim, Sarah', username: 'slim', office: 'Medical Records', status: 'Active', date_created: '2024-06-01', created_by: 'hruser' },
        { id: 7, fullname: 'Tan, James', username: 'jtan', office: 'Maintenance', status: 'Inactive', date_created: '2024-06-17', created_by: 'admin' },
        { id: 8, fullname: 'Mendoza, Liza', username: 'lmendoza', office: 'Accounting', status: 'Active', date_created: '2024-07-03', created_by: 'admin' },
        { id: 9, fullname: 'Gomez, Patrick', username: 'pgomez', office: 'IT', status: 'Inactive', date_created: '2024-07-15', created_by: 'admin' },
        { id: 10, fullname: 'Cruz, Diana', username: 'dcruz', office: 'Records', status: 'Active', date_created: '2024-08-10', created_by: 'admin' },
        { id: 11, fullname: 'Flores, Rico', username: 'rflores', office: 'HR', status: 'Active', date_created: '2024-08-22', created_by: 'hruser' },
        { id: 12, fullname: 'Torres, Cynthia', username: 'ctorres', office: 'Finance', status: 'Inactive', date_created: '2024-09-02', created_by: 'admin' },
        { id: 13, fullname: 'Garcia, Leo', username: 'lgarcia', office: 'Procurement', status: 'Active', date_created: '2024-09-11', created_by: 'admin' },
        { id: 14, fullname: 'Villanueva, Jenny', username: 'jvillanueva', office: 'Admin', status: 'Active', date_created: '2024-09-19', created_by: 'admin' },
        { id: 15, fullname: 'Uy, Allan', username: 'auy', office: 'IT', status: 'Inactive', date_created: '2024-10-02', created_by: 'sysadmin' },
        { id: 16, fullname: 'Bautista, Grace', username: 'gbautista', office: 'Records', status: 'Active', date_created: '2024-10-11', created_by: 'admin' },
        { id: 17, fullname: 'Ramos, Erwin', username: 'eramos', office: 'Maintenance', status: 'Inactive', date_created: '2024-10-20', created_by: 'admin' },
        { id: 18, fullname: 'Navarro, Ivy', username: 'inavarro', office: 'Medical Records', status: 'Active', date_created: '2024-11-03', created_by: 'hruser' },
        { id: 19, fullname: 'Castro, Benjie', username: 'bcastro', office: 'Accounting', status: 'Inactive', date_created: '2024-11-15', created_by: 'admin' },
        { id: 20, fullname: 'Domingo, Ella', username: 'edomingo', office: 'Finance', status: 'Active', date_created: '2024-11-30', created_by: 'admin' },
        { id: 21, fullname: 'Santiago, Noel', username: 'nsantiago', office: 'Engineering', status: 'Active', date_created: '2024-12-05', created_by: 'sysadmin' },
        { id: 22, fullname: 'Ramos, Kristine', username: 'kramos', office: 'HR', status: 'Inactive', date_created: '2024-12-17', created_by: 'admin' },
        { id: 23, fullname: 'Aquino, Ralph', username: 'raquino', office: 'Procurement', status: 'Active', date_created: '2025-01-08', created_by: 'admin' },
        { id: 24, fullname: 'Velasquez, Tina', username: 'tvelasquez', office: 'IT', status: 'Inactive', date_created: '2025-01-20', created_by: 'sysadmin' },
        { id: 25, fullname: 'Hernandez, Victor', username: 'vhernandez', office: 'Admin', status: 'Active', date_created: '2025-02-02', created_by: 'admin' },
    ];

    function test(name) {
        console.log(name);
    }

    onMount(() => {
        promise = App.API.get('http://127.0.0.1:8000/api/accounts', false);
    });

    function refreshTable() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            promise = App.API.get('http://127.0.0.1:8000/api/accounts', false);
        }, 400);
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
                <button type="button" class="btn btn-outline-secondary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
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
                                            <span class="text-muted me-2">Name:</span>
                                            <strong class="custom-link">{item.user.full_name2}</strong>
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
                                            <span>{item.created_at}</span>
                                        </div>
                                        <div>
                                            <span class="text-muted me-2">By:</span>
                                            <span>{item.created_by}</span>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <button
                                            class="btn btn-sm btn-outline-primary px-3"
                                            onclick={() => {
                                                test(item.user.full_name1);
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
