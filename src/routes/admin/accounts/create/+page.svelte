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
        account_modules: {
            admin: {
                access: false,
                accounts: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
                audit: {
                    access: false,
                    view: false,
                },
                offices: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
                document_types: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
                document_tags: {
                    access: false,
                    view: false,
                    edit: false,
                    delete: false,
                },
            },
        },
    });

    let officeList = $state([]);

    onMount(() => {
        initOfficeDropdown();
    });

    async function initOfficeDropdown() {
        const result = await App.API.post('http://127.0.0.1:8000/api/offices', { keyword: '', status: 'Active' }, false);

        if (result.success) {
            officeList = result.data.map((o) => o.short_name);
        }
    }

    $effect(() => {
        // If Admin Console is disabled, turn off all submodules' access
        if (!data.account_modules.admin.access) {
            for (const key in data.account_modules.admin) {
                if (key !== 'access') {
                    data.account_modules.admin[key].access = false;
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.account_modules.admin) {
            if (key !== 'access') {
                const submodule = data.account_modules.admin[key];
                if (!submodule.access) {
                    for (const perm in submodule) {
                        if (perm !== 'access') {
                            submodule[perm] = false;
                        }
                    }
                }
            }
        }
    });

    async function save(event) {
        // const button = event.currentTarget;
        // App.Button.el(button).setLoading('Saving...');

        const result = await App.API.post('http://127.0.0.1:8000/api/accounts', { data }, false);

        if (result.success) {
            console.log(result.data);
        } else {
            console.log(result);
        }

        // setTimeout(() => {
        //     goto('/admin/accounts');
        //     Alert.show('success', 'Success', 'Successfully created an account.');
        // }, 2000);
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
                                        <option value={office}></option>
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
                                    <option value="SR">SR.</option>
                                    <option value="JR">JR.</option>
                                    <option value="II">II.</option>
                                    <option value="III">III.</option>
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
                        <h5>Modules</h5>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <div class="form-check form-switch">
                                            <input bind:checked={data.account_modules.admin.access} class="form-check-input" type="checkbox" role="switch" id="adminConsole" />
                                            <label class="form-check-label small" for="adminConsole">Admin Console</label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <table class="table">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.accounts.access}
                                                                disabled={!data.account_modules.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="accounts"
                                                            />
                                                            <label class="form-check-label small" for="accounts">Accounts</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.accounts.view}
                                                                disabled={!data.account_modules.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="viewAccounts"
                                                            />
                                                            <label class="form-check-label small" for="viewAccounts">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.accounts.edit}
                                                                disabled={!data.account_modules.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="editAccounts"
                                                            />
                                                            <label class="form-check-label small" for="editAccounts">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.accounts.delete}
                                                                disabled={!data.account_modules.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="deleteAccounts"
                                                            />
                                                            <label class="form-check-label small" for="deleteAccounts">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.audit.access}
                                                                disabled={!data.account_modules.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="auditTrail"
                                                            />
                                                            <label class="form-check-label small" for="auditTrail">Audit Trail</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.audit.view}
                                                                disabled={!data.account_modules.admin.audit.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="viewAuditTrail"
                                                            />
                                                            <label class="form-check-label small" for="viewAuditTrail">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="editAuditTrail" disabled />
                                                            <label class="form-check-label small" for="editAuditTrail">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" id="deleteAuditTrail" disabled />
                                                            <label class="form-check-label small" for="deleteAuditTrail">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="table">
                                            <tbody>
                                                <tr>
                                                    <td colspan="4" class="small">Build-up</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.offices.access}
                                                                disabled={!data.account_modules.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="offices"
                                                            />
                                                            <label class="form-check-label small" for="offices">Offices</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.offices.view}
                                                                disabled={!data.account_modules.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="viewOffices"
                                                            />
                                                            <label class="form-check-label small" for="viewOffices">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.offices.edit}
                                                                disabled={!data.account_modules.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="editOffices"
                                                            />
                                                            <label class="form-check-label small" for="editOffices">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.offices.delete}
                                                                disabled={!data.account_modules.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="deleteOffices"
                                                            />
                                                            <label class="form-check-label small" for="deleteOffices">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_types.access}
                                                                disabled={!data.account_modules.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="documentTypes"
                                                            />
                                                            <label class="form-check-label small" for="documentTypes">Document Types</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_types.view}
                                                                disabled={!data.account_modules.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="viewDocumentTypes"
                                                            />
                                                            <label class="form-check-label small" for="viewDocumentTypes">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_types.edit}
                                                                disabled={!data.account_modules.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="editDocumentTypes"
                                                            />
                                                            <label class="form-check-label small" for="editDocumentTypes">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_types.delete}
                                                                disabled={!data.account_modules.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="deleteDocumentTypes"
                                                            />
                                                            <label class="form-check-label small" for="deleteDocumentTypes">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_tags.access}
                                                                disabled={!data.account_modules.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="documentTags"
                                                            />
                                                            <label class="form-check-label small" for="documentTags">Document Tags</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_tags.view}
                                                                disabled={!data.account_modules.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="viewDocumentTags"
                                                            />
                                                            <label class="form-check-label small" for="viewDocumentTags">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_tags.edit}
                                                                disabled={!data.account_modules.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="editDocumentTags"
                                                            />
                                                            <label class="form-check-label small" for="editDocumentTags">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.account_modules.admin.document_tags.delete}
                                                                disabled={!data.account_modules.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="deleteDocumentTags"
                                                            />
                                                            <label class="form-check-label small" for="deleteDocumentTags">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
