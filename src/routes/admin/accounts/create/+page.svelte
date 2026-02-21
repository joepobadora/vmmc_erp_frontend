<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    let data = $state({
        account: {
            username: '',
            password: '',
            confirm_password: '',
            status: true,
            office: '',
        },
        user: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: 'N/A',
            gender: '',
            birthdate: '',
        },
        role: '',
        module: {
            admin: {
                access: false,
                accounts: false,
                roles: false,
                offices: false,
                document_types: false,
                document_tags: false,
                audit_trail: false,
            },
            dex: {
                access: false,
                dms: {
                    documents: false,
                    reference_copies: false,
                    drafts: false,
                    archive: false,
                    trash: false,
                },
                dts: {
                    incoming: false,
                    inbox: false,
                    outgoing: false,
                    drafts: false,
                    broadcast_inbox: false,
                    archive: false,
                    trash: false,
                },
            },
            send: {
                access: false,
            },
            forms: {
                access: false,
            },
        },
    });

    let officeList = $state([]);
    let suffixList = $state([]);
    let roleList = $state([]);

    onMount(() => {
        initDropdown();
    });

    async function initDropdown() {
        try {
            const result = await App.API.get('/admin/accounts/create/dropdown');

            if (result.success) {
                suffixList = result.data.suffix;
                roleList = result.data.role;
                officeList = result.data.office;
            } else {
                Alert.show('error', 'Request failed.', result.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
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
                        <li class="breadcrumb-item"><a href="/admin/accounts">Accounts</a></li>
                        <li class="breadcrumb-item active">Create</li>
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
                            <h5>Create new user account</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Account</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Username</label>
                                <input bind:value={data.account.username} type="text" class="form-control form-control-sm" id="username" placeholder="Username" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="password" class="form-label small">Password</label>
                                <input bind:value={data.account.password} type="password" class="form-control form-control-sm" id="password" placeholder="Password" />
                            </div>
                            <div class="col-12 col-sm-6">
                                <label for="confirmPassword" class="form-label small">Confirm Password</label>
                                <input bind:value={data.account.confirm_password} type="password" class="form-control form-control-sm" id="confirmPassword" placeholder="Confirm password" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office</label>
                                <input bind:value={data.account.office} list="officeList" type="text" class="form-control form-control-sm" id="office" placeholder="Office" />
                                <datalist id="officeList">
                                    {#each officeList as office}
                                        <option value={office.short_name}></option>
                                    {/each}
                                </datalist>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <label for="status" class="form-label small">Status</label>
                                <div class="form-check form-switch">
                                    <input bind:checked={data.account.status} class="form-check-input" type="checkbox" id="status" />
                                    <label class="form-check-label small" for="status">Active</label>
                                </div>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Personal Info</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-3">
                                <label for="firstName" class="form-label small">First Name</label>
                                <input bind:value={data.user.first_name} type="text" class="form-control form-control-sm" id="firstName" placeholder="First name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="middleName" class="form-label small">Middle Name<span class="ms-1 text-muted fst-italic">(Optional)</span></label>
                                <input bind:value={data.user.middle_name} type="text" class="form-control form-control-sm" id="middleName" placeholder="Middle name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">Last Name</label>
                                <input bind:value={data.user.last_name} type="text" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Last name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="suffix" class="form-label small">Suffix<span class="ms-1 text-muted fst-italic">(Optional)</span></label>
                                <select bind:value={data.user.suffix} class="form-select form-select-sm" id="suffix">
                                    <option value="N/A" selected>N/A</option>
                                    {#each suffixList as suffix}
                                        <option value={suffix}>{suffix}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-3">
                                <label for="gender" class="form-label small">Gender</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input bind:group={data.user.gender} class="form-check-input" type="radio" name="inlineRadioOptions" id="male" value="Male" />
                                        <label class="form-check-label small" for="male">Male</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input bind:group={data.user.gender} class="form-check-input" type="radio" name="inlineRadioOptions" id="female" value="Female" />
                                        <label class="form-check-label small" for="female">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="birthdate" class="form-label small">Birthdate</label>
                                <input bind:value={data.user.birthdate} type="date" class="form-control form-control-sm" id="birthdate" />
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Access</h5>
                        <div class="row mb-4">
                            <div class="col-12 col-sm-6">
                                <label for="suffix" class="form-label small">Role</label>
                                <select bind:value={data.role} class="form-select form-select-sm" id="role">
                                    {#each roleList as role}
                                        <option value={role}>{role}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col">
                                <label for="modules" class="form-label small">Modules</label>
                                <table class="table" id="modules">
                                    <tbody
                                        ><tr>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.access} class="form-check-input" type="checkbox" id="dex" />
                                                    <label class="form-check-label small" for="dex"><i class="bi bi-diagram-3 me-2"></i>DEx</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dms.documents} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dmsDocuments" />
                                                    <label class="form-check-label small" for="dmsDocuments">Documents</label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dms.archive} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dmsArchive" />
                                                    <label class="form-check-label small" for="dmsArchive">Archive</label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dts.drafts} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dtsDrafts" />
                                                    <label class="form-check-label small" for="dtsDrafts">Drafts <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.dex.dms.reference_copies}
                                                        disabled={!data.module.dex.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="dmsReferenceCopies"
                                                    />
                                                    <label class="form-check-label small" for="dmsReferenceCopies">Reference Copies</label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dts.incoming} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dtsIncoming" />
                                                    <label class="form-check-label small" for="dtsIncoming">Incoming <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.dex.dts.broadcast_inbox}
                                                        disabled={!data.module.dex.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="dtsBroadcastInbox"
                                                    />
                                                    <label class="form-check-label small" for="dtsBroadcastInbox">Broadcast Inbox <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dms.drafts} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dmsDrafts" />
                                                    <label class="form-check-label small" for="dmsDrafts">Drafts</label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dts.inbox} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dtsInbox" />
                                                    <label class="form-check-label small" for="dtsInbox">Inbox <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dts.archive} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dtsArchive" />
                                                    <label class="form-check-label small" for="dtsArchive">Archive <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dms.trash} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dmsTrash" />
                                                    <label class="form-check-label small" for="dmsTrash">Trash</label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dts.outgoing} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dtsOutgoing" />
                                                    <label class="form-check-label small" for="dtsOutgoing">Outgoing <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.dex.dts.trash} disabled={!data.module.dex.access} class="form-check-input" type="checkbox" id="dtsTrash" />
                                                    <label class="form-check-label small" for="dtsTrash">Trash <span class="fst-italic">(Tracker)</span></label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.send.access} class="form-check-input" type="checkbox" id="send" />
                                                    <label class="form-check-label small" for="send"><i class="bi bi-send me-2"></i>SendIt</label>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.forms.access} class="form-check-input" type="checkbox" id="forms" />
                                                    <label class="form-check-label small" for="forms"><i class="bi bi-file-earmark-text me-2"></i>FormsHub</label>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input bind:checked={data.module.admin.access} class="form-check-input" type="checkbox" id="adminAccounts" />
                                                    <label class="form-check-label small" for="adminAccounts"><i class="bi bi-shield-lock me-2"></i>Admin Console</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.admin.accounts}
                                                        disabled={!data.module.admin.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="adminAccountsView"
                                                    />
                                                    <label class="form-check-label small" for="adminAccountsView">Accounts</label>
                                                </div>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.admin.audit_trail}
                                                        disabled={!data.module.admin.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="adminAccountsDelete"
                                                    />
                                                    <label class="form-check-label small" for="adminAccountsDelete">Audit Trail</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.admin.offices}
                                                        disabled={!data.module.admin.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="adminAccountsCreate"
                                                    />
                                                    <label class="form-check-label small" for="adminAccountsCreate">Offices</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.admin.document_types}
                                                        disabled={!data.module.admin.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="adminAccountsEdit"
                                                    />
                                                    <label class="form-check-label small" for="adminAccountsEdit">Document Types</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        bind:checked={data.module.admin.document_tags}
                                                        disabled={!data.module.admin.access}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        id="adminAccountsDelete"
                                                    />
                                                    <label class="form-check-label small" for="adminAccountsDelete">Document Tags</label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <button onclick={save} type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-check2 me-2"></i>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
