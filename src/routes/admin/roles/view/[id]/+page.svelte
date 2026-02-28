<script>
    import { goto } from '$app/navigation';
    import { Alert } from '$lib/stores/alert';

    let { data } = $props();

    let code = $state(data.code ?? '');
    let name = $state(data.name ?? '');
    let description = $state(data.description ?? '');
    let status = $state(data.status ?? false);
    let permissions = $state(data.permissions ?? []);

    let checked = 'text-success bi-check-circle-fill';
    let unchecked = 'text-secondary bi-check-circle';
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
                        <li class="breadcrumb-item"><a href="/admin/roles">Roles</a></li>
                        <li class="breadcrumb-item active">View</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <!-- account -->
                <div class="card shadow-sm border-0 p-2 mb-4">
                    <div class="card-body">
                        <div class="mb-4">
                            <h5>View a role</h5>
                            <p class="small text-muted">
                                A role defines the specific permissions granted to a user, determining which actions they can perform within the system. Roles help enforce security and ensure users
                                can only access functions relevant to their responsibilities.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Role</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="code" class="form-label small">Code</label>
                                <input bind:value={code} type="text" class="form-control form-control-sm" id="code" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="name" class="form-label small">Name</label>
                                <input bind:value={name} type="text" class="form-control form-control-sm" id="name" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="name" class="form-label small">Description</label>
                                <input bind:value={description} type="text" class="form-control form-control-sm" id="name" disabled />
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <label for="status" class="form-label small">Status</label>
                                <div>
                                    <span class="badge bg-{status == true ? 'success' : 'danger'}">{status == true ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Permissions</h5>
                        <div class="row mb-4">
                            <div class="col">
                                <label for="dex" class="form-label small">DEx</label>
                                <table class="table" id="dex">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-folder me-2"></i>Documents</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DOCS_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DOCS_SIGN') == true ? checked : unchecked} me-2"></i>Sign</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DOCS_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DOCS_ROUTE') == true ? checked : unchecked} me-2"></i>Route</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DOCS_DOWNLOAD') == true ? checked : unchecked} me-2"></i>Download</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DOCS_ARCHIVE') == true ? checked : unchecked} me-2"></i>Archive</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-folder me-2"></i>Reference Copies</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.REFCOPIES_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.REFCOPIES_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.REFCOPIES_DOWNLOAD') == true ? checked : unchecked} me-2"></i>Download</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.REFCOPIES_ARCHIVE') == true ? checked : unchecked} me-2"></i>Archive</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-pencil-square me-2"></i>Drafts</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_POST') == true ? checked : unchecked} me-2"></i>Post</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_REVIEW') == true ? checked : unchecked} me-2"></i>Review</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_APPROVE') == true ? checked : unchecked} me-2"></i>Approve</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.DRAFTS_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-archive me-2"></i>Archive</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.ARCHIVE_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.ARCHIVE_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-trash me-2"></i>Trash</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.TRASH_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.TRASH_RESTORE') == true ? checked : unchecked} me-2"></i>Restore</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DMS.TRASH_PERMADELETE') == true ? checked : unchecked} me-2"></i>Permanently Delete</div>
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-box-arrow-in-down me-2"></i>Incoming <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INCOMING_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INCOMING_REJECT') == true ? checked : unchecked} me-2"></i>Reject</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INCOMING_ACKNOWLEDGE') == true ? checked : unchecked} me-2"></i>Acknowledge</div>
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-inbox me-2"></i>Inbox <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INBOX_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INBOX_RETRIEVE') == true ? checked : unchecked} me-2"></i>Retrieve</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INBOX_FORWARD') == true ? checked : unchecked} me-2"></i>Forward</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.INBOX_TERMINATE') == true ? checked : unchecked} me-2"></i>Terminate</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-send me-2"></i>Outgoing <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.OUTGOING_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.OUTGOING_RECALL') == true ? checked : unchecked} me-2"></i>Recall</div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-file-earmark-text me-2"></i>Drafts <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.DRAFTS_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                                <div class="small"><i class="bi {permissions.includes('DTS.DRAFTS_POST') == true ? checked : unchecked} me-2"></i>Post</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.DRAFTS_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.DRAFTS_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.DRAFTS_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-megaphone me-2"></i>Broadcast Inbox <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.BROADCAST_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.BROADCAST_RETRIEVE') == true ? checked : unchecked} me-2"></i>Retrieve</div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-archive me-2"></i>Archive <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.ARCHIVE_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.ARCHIVE_RETRIEVE') == true ? checked : unchecked} me-2"></i>Retrieve</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.ARCHIVE_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-trash me-2"></i>Trash <span class="fst-italic">(Tracker)</span></p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.TRASH_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.TRASH_RESTORE') == true ? checked : unchecked} me-2"></i>Restore</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('DTS.TRASH_PERMADELETE') == true ? checked : unchecked} me-2"></i>Permanently Delete</div>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col">
                                <label for="admin" class="form-label small">Admin</label>
                                <table class="table" id="admin">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-people me-2"></i>Accounts</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ACC_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ACC_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ACC_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ACC_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-shield-lock me-2"></i>Roles</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ROLES_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ROLES_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ROLES_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.ROLES_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-geo-alt me-2"></i>Offices</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.OFFICES_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.OFFICES_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.OFFICES_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.OFFICES_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-file-earmark-code me-2"></i>Document Types</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTYPES_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTYPES_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTYPES_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTYPES_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-tags me-2"></i>Document Tags</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTAGS_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTAGS_CREATE') == true ? checked : unchecked} me-2"></i>Create</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTAGS_EDIT') == true ? checked : unchecked} me-2"></i>Edit</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.DOCTAGS_DELETE') == true ? checked : unchecked} me-2"></i>Delete</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p class="small" for="dmsDocuments"><i class="bi bi-clock-history me-2"></i>Audit Trail</p>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {permissions.includes('ADMIN.AUDIT_VIEW') == true ? checked : unchecked} me-2"></i>View</div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <a href="/admin/roles"> <button type="button" class="btn btn-primary btn-sm px-3">Okay</button></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
