<script>
    import { page } from '$app/stores';
    import Table from '$lib/components/Table.svelte';

    const docTypes = [
        { id: 1, document_type: 'Purchase Request', status: 'Active' },
        { id: 2, document_type: 'Job Order', status: 'Active' },
        { id: 3, document_type: 'Disbursement Voucher', status: 'Inactive' },
        { id: 4, document_type: 'Patient Record Form', status: 'Active' },
        { id: 5, document_type: 'Equipment Maintenance Log', status: 'Inactive' },
        { id: 6, document_type: 'Inventory Report', status: 'Active' },
        { id: 7, document_type: 'Incident Report', status: 'Inactive' },
        { id: 8, document_type: 'Leave Application', status: 'Active' },
        { id: 9, document_type: 'Billing Statement', status: 'Inactive' },
        { id: 10, document_type: 'Medical Referral Slip', status: 'Active' },
        { id: 11, document_type: 'Project Proposal', status: 'Active' },
        { id: 12, document_type: 'Procurement Plan', status: 'Inactive' },
        { id: 13, document_type: 'Asset Transfer Form', status: 'Active' },
        { id: 14, document_type: 'Payroll Summary', status: 'Active' },
        { id: 15, document_type: 'Reimbursement Form', status: 'Inactive' },
        { id: 16, document_type: 'Supplier Evaluation Form', status: 'Active' },
        { id: 17, document_type: 'Confidential Report', status: 'Inactive' },
        { id: 18, document_type: 'Budget Allocation Form', status: 'Active' },
        { id: 19, document_type: 'Performance Appraisal', status: 'Inactive' },
        { id: 20, document_type: 'Staff Attendance Sheet', status: 'Active' },
        { id: 21, document_type: 'IT Support Request', status: 'Active' },
        { id: 22, document_type: 'Building Maintenance Report', status: 'Inactive' },
        { id: 23, document_type: 'Training Evaluation Form', status: 'Active' },
        { id: 24, document_type: 'Visitor Logbook', status: 'Inactive' },
        { id: 25, document_type: 'Medical Supply Request', status: 'Active' },
    ];

    function test(name) {
        console.log(name);
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
                        <li class="breadcrumb-item active">Document Types</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><a class="btn btn-primary btn-sm px-3" href={$page.url.pathname + '/add'}><i class="bi bi-plus-lg me-2"></i>Add</a></div>
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
                <Table data={docTypes} enableTotalCount enablePagination pageSize="10">
                    <div slot="row" let:item class="row border-bottom custom-row small">
                        <div class="col-auto d-flex align-items-center">
                            <strong>{item.id}</strong>
                        </div>
                        <div class="col d-flex align-items-center">
                            <div class="text-muted">{item.document_type}</div>
                        </div>
                        <div class="col-auto">
                            <button
                                class="btn btn-sm btn-outline-primary px-3"
                                onclick={() => {
                                    test(item.document_type);
                                }}>Edit</button
                            >
                        </div>
                    </div>
                </Table>
            </div>
        </div>
    </div>
</div>
