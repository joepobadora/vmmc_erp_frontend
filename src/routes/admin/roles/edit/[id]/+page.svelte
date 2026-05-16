<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';

    let auth = $state();

    let { data } = $props();

    let code = $state(data.code ?? '');
    let name = $state(data.name ?? '');
    let description = $state(data.description ?? '');
    let status = $state(data.status ?? false);
    let permissions = $state(data.permissions ?? []);

    let saving = $state(false);
    let deleting = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z.object({
        name: z.string().nonempty('Required.'),
    });

    async function save() {
        const validate = schema.safeParse({
            name,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        try {
            // password auth
            if (!(await auth.confirm())) return;

            // udpate button state
            saving = true;

            const result = await App.API.post(`/admin/roles/update/${page.params.id}`, {
                name: name,
                description: description,
                status: status,
                permissions: permissions,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/roles${p.toString()}`);
                    Alert.show('success', 'Update success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Update failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            saving = false;
        }
    }

    async function destroy() {
        try {
            // password auth
            if (!(await auth.confirm())) return;

            // udpate button state
            deleting = true;

            const result = await App.API.post(`/admin/roles/destroy/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/roles${p.toString()}`);
                    Alert.show('success', 'Deletion success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Deletion failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            deleting = false;
        }
    }
</script>

<Auth bind:me={auth} warning="You are about to update a role." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/roles{p.toString()}">Roles</a></li>
            <li class="breadcrumb-item small active">Edit</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Edit a role</h5>
        <p class="small text-muted">
            A role defines the specific permissions granted to a user, determining which actions they can perform within the system. Roles help enforce security and ensure users can only access
            functions relevant to their responsibilities.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Role</h5>
    <j.Row>
        <j.Col span="6">
            <label for="name" class="form-label small">Code</label>
            <input bind:value={code} type="text" class="form-control form-control-sm" id="name" placeholder="OFFICE_POSITION" disabled />
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
            <label for="name" class="form-label small">Name<span class="ms-1 text-danger">*</span></label>
            <input bind:value={name} type="text" class="form-control form-control-sm {errors.name ? 'is-invalid' : ''}" id="name" placeholder="Name" />
            <p class="text-danger small mb-auto {errors.name ? '' : 'd-none'}">{errors.name?.[0]}</p>
        </j.Col>
    </j.Row>
    <j.RowCol>
        <label for="name" class="form-label small">Description</label>
        <input bind:value={description} type="text" class="form-control form-control-sm" id="name" placeholder="Description" />
    </j.RowCol>
    <j.RowCol>
        <label for="status" class="form-label small">Status</label>
        <div class="form-check form-switch">
            <input bind:checked={status} class="form-check-input" type="checkbox" id="status" />
            <label class="form-check-label small" for="status">Active</label>
        </div>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Permissions</h5>
    <j.RowCol>
        <label for="dex" class="form-label small">DEx</label>
        <table class="table" id="dex">
            <tbody>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-folder me-2"></i>Documents</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_VIEW']} class="form-check-input" type="checkbox" id="dmsDocumentsView" />
                            <label class="form-check-label small" for="dmsDocumentsView">View</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_SIGN']} class="form-check-input" type="checkbox" id="dmsDocumentsSign" />
                            <label class="form-check-label small" for="dmsDocumentsSign">Sign</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_DELETE']} class="form-check-input" type="checkbox" id="dmsDocumentsDelete" />
                            <label class="form-check-label small" for="dmsDocumentsDelete">Delete</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_ROUTE']} class="form-check-input" type="checkbox" id="dmsDocumentsRoute" />
                            <label class="form-check-label small" for="dmsDocumentsRoute">Route</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_EDIT']} class="form-check-input" type="checkbox" id="dmsDocumentsEdit" />
                            <label class="form-check-label small" for="dmsDocumentsEdit">Edit</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_DOWNLOAD']} class="form-check-input" type="checkbox" id="dmsDocumentsDownload" />
                            <label class="form-check-label small" for="dmsDocumentsDownload">Download</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DOCS_ARCHIVE']} class="form-check-input" type="checkbox" id="dmsDocumentsArchive" />
                            <label class="form-check-label small" for="dmsDocumentsArchive">Archive</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-folder me-2"></i>Reference Copies</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.REFCOPIES_VIEW']} class="form-check-input" type="checkbox" id="dmsRefView" />
                            <label class="form-check-label small" for="dmsRefView">View</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.REFCOPIES_DOWNLOAD']} class="form-check-input" type="checkbox" id="dmsRefDownload" />
                            <label class="form-check-label small" for="dmsRefDownload">Download</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.REFCOPIES_DELETE']} class="form-check-input" type="checkbox" id="dmsRefDelete" />
                            <label class="form-check-label small" for="dmsRefDelete">Delete</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.REFCOPIES_EDIT']} class="form-check-input" type="checkbox" id="dmsRefEdit" />
                            <label class="form-check-label small" for="dmsRefEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.REFCOPIES_ARCHIVE']} class="form-check-input" type="checkbox" id="dmsRefArchive" />
                            <label class="form-check-label small" for="dmsRefArchive">Archive</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-pencil-square me-2"></i>Drafts</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_VIEW']} class="form-check-input" type="checkbox" id="dmsDraftsView" />
                            <label class="form-check-label small" for="dmsDraftsView">View</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_POST']} class="form-check-input" type="checkbox" id="dmsDraftsPost" />
                            <label class="form-check-label small" for="dmsDraftsPost">Post</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_CREATE']} class="form-check-input" type="checkbox" id="dmsDraftsCreate" />
                            <label class="form-check-label small" for="dmsDraftsCreate">Create</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_REVIEW']} class="form-check-input" type="checkbox" id="dmsDraftsReview" />
                            <label class="form-check-label small" for="dmsDraftsReview">Review</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_EDIT']} class="form-check-input" type="checkbox" id="dmsDraftsEdit" />
                            <label class="form-check-label small" for="dmsDraftsEdit">Edit</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_APPROVE']} class="form-check-input" type="checkbox" id="dmsDraftsApprove" />
                            <label class="form-check-label small" for="dmsDraftsApprove">Approve</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.DRAFTS_DELETE']} class="form-check-input" type="checkbox" id="dmsDraftsDelete" />
                            <label class="form-check-label small" for="dmsDraftsDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-archive me-2"></i>Archive</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.ARCHIVE_VIEW']} class="form-check-input" type="checkbox" id="dmsArchiveView" />
                            <label class="form-check-label small" for="dmsArchiveView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.ARCHIVE_DELETE']} class="form-check-input" type="checkbox" id="dmsArchiveDelete" />
                            <label class="form-check-label small" for="dmsArchiveDelete">Delete</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.ARCHIVE_EDIT']} class="form-check-input" type="checkbox" id="dmsArchiveEdit" />
                            <label class="form-check-label small" for="dmsArchiveEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.ARCHIVE_DOWNLOAD']} class="form-check-input" type="checkbox" id="dmsArchiveDownload" />
                            <label class="form-check-label small" for="dmsArchiveDownload">Download</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-trash me-2"></i>Trash</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.TRASH_VIEW']} class="form-check-input" type="checkbox" id="dmsTrashView" />
                            <label class="form-check-label small" for="dmsTrashView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.TRASH_RESTORE']} class="form-check-input" type="checkbox" id="dmsTrashRestore" />
                            <label class="form-check-label small" for="dmsTrashRestore">Restore</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DMS.TRASH_PERMADELETE']} class="form-check-input" type="checkbox" id="dmsTrashPermaDelete" />
                            <label class="form-check-label small" for="dmsTrashPermaDelete">Permanently Delete</label>
                        </div>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-box-arrow-in-down me-2"></i>Incoming <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INCOMING_VIEW']} class="form-check-input" type="checkbox" id="dtsIncomingView" />
                            <label class="form-check-label small" for="dtsIncomingView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INCOMING_REJECT']} class="form-check-input" type="checkbox" id="dtsIncomingReject" />
                            <label class="form-check-label small" for="dtsIncomingReject">Reject</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INCOMING_ACKNOWLEDGE']} class="form-check-input" type="checkbox" id="dtsIncomingAck" />
                            <label class="form-check-label small" for="dtsIncomingAck">Acknowledge</label>
                        </div>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-inbox me-2"></i>Inbox <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INBOX_VIEW']} class="form-check-input" type="checkbox" id="dtsInboxView" />
                            <label class="form-check-label small" for="dtsInboxView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INBOX_RETRIEVE']} class="form-check-input" type="checkbox" id="dtsInboxRetrieve" />
                            <label class="form-check-label small" for="dtsInboxRetrieve">Retrieve</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INBOX_FORWARD']} class="form-check-input" type="checkbox" id="dtsInboxForward" />
                            <label class="form-check-label small" for="dtsInboxForward">Forward</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.INBOX_TERMINATE']} class="form-check-input" type="checkbox" id="dtsInboxTerminate" />
                            <label class="form-check-label small" for="dtsInboxTerminate">Terminate</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-send me-2"></i>Outgoing <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.OUTGOING_VIEW']} class="form-check-input" type="checkbox" id="dtsOutgoingView" />
                            <label class="form-check-label small" for="dtsOutgoingView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.OUTGOING_RECALL']} class="form-check-input" type="checkbox" id="dtsOutgoingRecall" />
                            <label class="form-check-label small" for="dtsOutgoingRecall">Recall</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-file-earmark-text me-2"></i>Drafts <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.DRAFTS_VIEW']} class="form-check-input" type="checkbox" id="dtsDraftsView" />
                            <label class="form-check-label small" for="dtsDraftsView">View</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.DRAFTS_POST']} class="form-check-input" type="checkbox" id="dtsDraftsPost" />
                            <label class="form-check-label small" for="dtsDraftsPost">Post</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.DRAFTS_CREATE']} class="form-check-input" type="checkbox" id="dtsDraftsCreate" />
                            <label class="form-check-label small" for="dtsDraftsCreate">Create</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.DRAFTS_EDIT']} class="form-check-input" type="checkbox" id="dtsDraftsEdit" />
                            <label class="form-check-label small" for="dtsDraftsEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.DRAFTS_DELETE']} class="form-check-input" type="checkbox" id="dtsDraftsDelete" />
                            <label class="form-check-label small" for="dtsDraftsDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-megaphone me-2"></i>Broadcast Inbox <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.BROADCAST_VIEW']} class="form-check-input" type="checkbox" id="dtsBroadcastView" />
                            <label class="form-check-label small" for="dtsBroadcastView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.BROADCAST_RETRIEVE']} class="form-check-input" type="checkbox" id="dtsBroadcastRetrieve" />
                            <label class="form-check-label small" for="dtsBroadcastRetrieve">Retrieve</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-archive me-2"></i>Archive <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.ARCHIVE_VIEW']} class="form-check-input" type="checkbox" id="dtsArchiveView" />
                            <label class="form-check-label small" for="dtsArchiveView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.ARCHIVE_RETRIEVE']} class="form-check-input" type="checkbox" id="dtsArchiveRetrieve" />
                            <label class="form-check-label small" for="dtsArchiveRetrieve">Retrieve</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.ARCHIVE_DELETE']} class="form-check-input" type="checkbox" id="dtsArchiveDelete" />
                            <label class="form-check-label small" for="dtsArchiveDelete">Delete</label>
                        </div>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-trash me-2"></i>Trash <span class="fst-italic">(Tracker)</span></p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.TRASH_VIEW']} class="form-check-input" type="checkbox" id="dtsTrashView" />
                            <label class="form-check-label small" for="dtsTrashView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.TRASH_RESTORE']} class="form-check-input" type="checkbox" id="dtsTrashRestore" />
                            <label class="form-check-label small" for="dtsTrashRestore">Restore</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['DTS.TRASH_PERMADELETE']} class="form-check-input" type="checkbox" id="dtsTrashPermaDelete" />
                            <label class="form-check-label small" for="dtsTrashPermaDelete">Permanently Delete</label>
                        </div>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </j.RowCol>
    <j.RowCol>
        <label for="admin" class="form-label small">Admin</label>
        <table class="table" id="admin">
            <tbody>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-people me-2"></i>Accounts</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ACC_VIEW']} class="form-check-input" type="checkbox" id="adminAccountsView" />
                            <label class="form-check-label small" for="adminAccountsView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ACC_CREATE']} class="form-check-input" type="checkbox" id="adminAccountsCreate" />
                            <label class="form-check-label small" for="adminAccountsCreate">Create</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ACC_EDIT']} class="form-check-input" type="checkbox" id="adminAccountsEdit" />
                            <label class="form-check-label small" for="adminAccountsEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ACC_DELETE']} class="form-check-input" type="checkbox" id="adminAccountsDelete" />
                            <label class="form-check-label small" for="adminAccountsDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-shield-lock me-2"></i>Roles</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ROLES_VIEW']} class="form-check-input" type="checkbox" id="adminRolesView" />
                            <label class="form-check-label small" for="adminRolesView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ROLES_CREATE']} class="form-check-input" type="checkbox" id="adminRolesCreate" />
                            <label class="form-check-label small" for="adminRolesCreate">Create</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ROLES_EDIT']} class="form-check-input" type="checkbox" id="adminRolesEdit" />
                            <label class="form-check-label small" for="adminRolesEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.ROLES_DELETE']} class="form-check-input" type="checkbox" id="adminRolesDelete" />
                            <label class="form-check-label small" for="adminRolesDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-geo-alt me-2"></i>Offices</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.OFFICES_VIEW']} class="form-check-input" type="checkbox" id="adminOfficesView" />
                            <label class="form-check-label small" for="adminOfficesView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.OFFICES_CREATE']} class="form-check-input" type="checkbox" id="adminOfficesCreate" />
                            <label class="form-check-label small" for="adminOfficesCreate">Create</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.OFFICES_EDIT']} class="form-check-input" type="checkbox" id="adminOfficesEdit" />
                            <label class="form-check-label small" for="adminOfficesEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.OFFICES_DELETE']} class="form-check-input" type="checkbox" id="adminOfficesDelete" />
                            <label class="form-check-label small" for="adminOfficesDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-file-earmark-code me-2"></i>Document Types</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTYPES_VIEW']} class="form-check-input" type="checkbox" id="adminDocTypesView" />
                            <label class="form-check-label small" for="adminDocTypesView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTYPES_CREATE']} class="form-check-input" type="checkbox" id="adminDocTypesCreate" />
                            <label class="form-check-label small" for="adminDocTypesCreate">Create</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTYPES_EDIT']} class="form-check-input" type="checkbox" id="adminDocTypesEdit" />
                            <label class="form-check-label small" for="adminDocTypesEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTYPES_DELETE']} class="form-check-input" type="checkbox" id="adminDocTypesDelete" />
                            <label class="form-check-label small" for="adminDocTypesDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-tags me-2"></i>Document Tags</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTAGS_VIEW']} class="form-check-input" type="checkbox" id="adminDocTagsView" />
                            <label class="form-check-label small" for="adminDocTagsView">View</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTAGS_CREATE']} class="form-check-input" type="checkbox" id="adminDocTagsCreate" />
                            <label class="form-check-label small" for="adminDocTagsCreate">Create</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTAGS_EDIT']} class="form-check-input" type="checkbox" id="adminDocTagsEdit" />
                            <label class="form-check-label small" for="adminDocTagsEdit">Edit</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.DOCTAGS_DELETE']} class="form-check-input" type="checkbox" id="adminDocTagsDelete" />
                            <label class="form-check-label small" for="adminDocTagsDelete">Delete</label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p class="small" for="dmsDocuments"><i class="bi bi-clock-history me-2"></i>Audit Trail</p>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={permissions['ADMIN.AUDIT_VIEW']} class="form-check-input" type="checkbox" id="adminAuditView" />
                            <label class="form-check-label small" for="adminAuditView">View</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Maintenance</h5>
    <j.RowCol>
        <label for="password" class="form-label small">Role</label>
        <div>
            <j.Button label="Delete Role" variant="danger" loadinglabel="Deleting" icon="bi-x-lg" loading={deleting} onClick={destroy} />
        </div>
    </j.RowCol>
    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/admin/roles${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
</j.Card>
