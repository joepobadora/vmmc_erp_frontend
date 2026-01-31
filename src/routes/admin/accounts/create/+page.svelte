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
        permission: {
            role: '',
            admin: {
                access: false,
                accounts: {
                    access: false,
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },
                roles: {
                    access: false,
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
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
                audit_trail: {
                    access: false,
                    view: false,
                },
            },
            dex: {
                access: false,
                dms: {
                    documents: {
                        access: false,
                        view: false,
                        delete: false,
                        download: false,
                        archive: false,
                        sign: false,
                        route: false,
                    },
                    reference_copies: {
                        access: false,
                        view: false,
                        delete: false,
                        download: false,
                        archive: false,
                    },
                    drafts: {
                        access: false,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        post: false,
                        review: false,
                        approve: false,
                    },
                    archive: {
                        access: false,
                        view: false,
                        delete: false,
                    },
                    trash: {
                        access: false,
                        view: false,
                        restore: false,
                        permanently_delete: false,
                    },
                },
                dts: {
                    incoming: {
                        access: false,
                        view: false,
                        reject: false,
                        acknowledge: false,
                    },
                    inbox: {
                        access: false,
                        view: false,
                        retrieve: false,
                        forward: false,
                        terminate: false,
                    },
                    outgoing: {
                        access: false,
                        view: false,
                        recall: false,
                    },
                    drafts: {
                        access: false,
                        view: false,
                        create: false,
                        edit: false,
                        delete: false,
                        post: false,
                    },
                    broadcast_inbox: {
                        access: false,
                        view: false,
                        retrieve: false,
                    },
                    archive: {
                        access: false,
                        view: false,
                        retrieve: false,
                        delete: false,
                    },
                    trash: {
                        access: false,
                        view: false,
                        restore: false,
                        permanently_delete: false,
                    },
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
        if (!data.permission.admin.access) {
            for (const key in data.permission.admin) {
                if (key !== 'access') {
                    data.permission.admin[key].access = false;
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.permission.admin) {
            if (key !== 'access') {
                const submodule = data.permission.admin[key];
                if (!submodule.access) {
                    for (const perm in submodule) {
                        if (perm !== 'access') {
                            submodule[perm] = false;
                        }
                    }
                }
            }
        }

        // If DEx is disabled, turn off all submodules' access
        if (!data.permission.dex.access) {
            for (const key in data.permission.dex.dms) {
                if (key !== 'access') {
                    data.permission.dex.dms[key].access = false;
                }
            }
            for (const key in data.permission.dex.dts) {
                if (key !== 'access') {
                    data.permission.dex.dts[key].access = false;
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.permission.dex.dms) {
            if (key !== 'access') {
                const submodule = data.permission.dex.dms[key];
                if (!submodule.access) {
                    for (const perm in submodule) {
                        if (perm !== 'access') {
                            submodule[perm] = false;
                        }
                    }
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.permission.dex.dts) {
            if (key !== 'access') {
                const submodule = data.permission.dex.dts[key];
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
                        <h5>Roles & Permissions</h5>
                        <div class="row mb-4">
                            <div class="col-12 col-sm-6">
                                <label for="suffix" class="form-label small">Role</label>
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
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <div class="form-check form-switch">
                                            <input bind:checked={data.permission.admin.access} class="form-check-input" type="checkbox" role="switch" id="adminConsole" />
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
                                                                bind:checked={data.permission.admin.accounts.access}
                                                                disabled={!data.permission.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAccounts"
                                                            />
                                                            <label class="form-check-label small" for="adminAccounts"><i class="bi bi-people me-2"></i>Accounts</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.accounts.view}
                                                                disabled={!data.permission.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAccountsView"
                                                            />
                                                            <label class="form-check-label small" for="adminAccountsView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.accounts.create}
                                                                disabled={!data.permission.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAccountsCreate"
                                                            />
                                                            <label class="form-check-label small" for="adminAccountsCreate">Create</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.accounts.edit}
                                                                disabled={!data.permission.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAccountsEdit"
                                                            />
                                                            <label class="form-check-label small" for="adminAccountsEdit">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.accounts.delete}
                                                                disabled={!data.permission.admin.accounts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAccountsDelete"
                                                            />
                                                            <label class="form-check-label small" for="adminAccountsDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.roles.access}
                                                                disabled={!data.permission.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminRoles"
                                                            />
                                                            <label class="form-check-label small" for="adminRoles"><i class="bi bi-shield-lock me-2"></i>Roles</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.roles.view}
                                                                disabled={!data.permission.admin.roles.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminRolesView"
                                                            />
                                                            <label class="form-check-label small" for="adminRolesView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.roles.create}
                                                                disabled={!data.permission.admin.roles.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminRolesCreate"
                                                            />
                                                            <label class="form-check-label small" for="adminRolesCreate">Create</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.roles.edit}
                                                                disabled={!data.permission.admin.roles.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminRolesEdit"
                                                            />
                                                            <label class="form-check-label small" for="adminRolesEdit">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.roles.delete}
                                                                disabled={!data.permission.admin.roles.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminRolesDelete"
                                                            />
                                                            <label class="form-check-label small" for="adminRolesDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.offices.access}
                                                                disabled={!data.permission.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminOffices"
                                                            />
                                                            <label class="form-check-label small" for="adminOffices"><i class="bi bi-geo-alt me-2"></i>Offices</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.offices.view}
                                                                disabled={!data.permission.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminOfficesView"
                                                            />
                                                            <label class="form-check-label small" for="adminOfficesView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.offices.create}
                                                                disabled={!data.permission.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminOfficesCreate"
                                                            />
                                                            <label class="form-check-label small" for="adminOfficesCreate">Create</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.offices.edit}
                                                                disabled={!data.permission.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminOfficesEdit"
                                                            />
                                                            <label class="form-check-label small" for="adminOfficesEdit">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.offices.delete}
                                                                disabled={!data.permission.admin.offices.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminOfficesDelete"
                                                            />
                                                            <label class="form-check-label small" for="adminOfficesDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_types.access}
                                                                disabled={!data.permission.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTypes"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTypes"><i class="bi bi-file-earmark-code me-2"></i>Document Types</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_types.view}
                                                                disabled={!data.permission.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTypesView"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTypesView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_types.create}
                                                                disabled={!data.permission.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTypesCreate"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTypesCreate">Create</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_types.edit}
                                                                disabled={!data.permission.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTypesEdit"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTypesEdit">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_types.delete}
                                                                disabled={!data.permission.admin.document_types.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTypesDelete"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTypesDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_tags.access}
                                                                disabled={!data.permission.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTags"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTags"><i class="bi bi-tags me-2"></i>Document Tags</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_tags.view}
                                                                disabled={!data.permission.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTagsView"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTagsView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_tags.create}
                                                                disabled={!data.permission.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTagsCreate"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTagsCreate">Create</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_tags.edit}
                                                                disabled={!data.permission.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTagsEdit"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTagsEdit">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.document_tags.delete}
                                                                disabled={!data.permission.admin.document_tags.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminDocTagsDelete"
                                                            />
                                                            <label class="form-check-label small" for="adminDocTagsDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.audit_trail.access}
                                                                disabled={!data.permission.admin.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAudit"
                                                            />
                                                            <label class="form-check-label small" for="adminAudit"><i class="bi bi-clock-history me-2"></i>Audit Trail</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.admin.audit_trail.view}
                                                                disabled={!data.permission.admin.audit_trail.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="adminAuditView"
                                                            />
                                                            <label class="form-check-label small" for="adminAuditView">View</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <div class="form-check form-switch">
                                            <input bind:checked={data.permission.dex.access} class="form-check-input" type="checkbox" role="switch" id="dex" />
                                            <label class="form-check-label small" for="dex">DEx</label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <table class="table">
                                            <tbody>
                                                <tr>
                                                    <td class="small">Document Manager</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocuments"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocuments"><i class="bi bi-folder me-2"></i>Documents</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.view}
                                                                disabled={!data.permission.dex.dms.documents.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocumentsView"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocumentsView">View</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.sign}
                                                                disabled={!data.permission.dex.dms.documents.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocumentsSign"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocumentsSign">Sign</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.delete}
                                                                disabled={!data.permission.dex.dms.documents.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocumentsDelete"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocumentsDelete">Delete</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.route}
                                                                disabled={!data.permission.dex.dms.documents.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocumentsRoute"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocumentsRoute">Route</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.download}
                                                                disabled={!data.permission.dex.dms.documents.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocumentsDownload"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocumentsDownload">Download</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.documents.archive}
                                                                disabled={!data.permission.dex.dms.documents.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDocumentsArchive"
                                                            />
                                                            <label class="form-check-label small" for="dmsDocumentsArchive">Archive</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.reference_copies.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsRef"
                                                            />
                                                            <label class="form-check-label small" for="dmsRef"><i class="bi bi-folder me-2"></i>Reference Copies</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.reference_copies.view}
                                                                disabled={!data.permission.dex.dms.reference_copies.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsRefView"
                                                            />
                                                            <label class="form-check-label small" for="dmsRefView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.reference_copies.delete}
                                                                disabled={!data.permission.dex.dms.reference_copies.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsRefDelete"
                                                            />
                                                            <label class="form-check-label small" for="dmsRefDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.reference_copies.download}
                                                                disabled={!data.permission.dex.dms.reference_copies.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsRefDownload"
                                                            />
                                                            <label class="form-check-label small" for="dmsRefDownload">Download</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.reference_copies.archive}
                                                                disabled={!data.permission.dex.dms.reference_copies.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsRefArchive"
                                                            />
                                                            <label class="form-check-label small" for="dmsRefArchive">Archive</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDrafts"
                                                            />
                                                            <label class="form-check-label small" for="dmsDrafts"><i class="bi bi-pencil-square me-2"></i>Drafts</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.view}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsView"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsView">View</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.post}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsPost"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsPost">Post</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.create}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsCreate"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsCreate">Create</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.review}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsReview"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsReview">Review</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.edit}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsEdit"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsEdit">Edit</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.approve}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsApprove"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsApprove">Approve</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.drafts.delete}
                                                                disabled={!data.permission.dex.dms.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsDraftsDelete"
                                                            />
                                                            <label class="form-check-label small" for="dmsDraftsDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.archive.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsArchive"
                                                            />
                                                            <label class="form-check-label small" for="dmsArchive"><i class="bi bi-archive me-2"></i>Archive</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.archive.view}
                                                                disabled={!data.permission.dex.dms.archive.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsArchiveView"
                                                            />
                                                            <label class="form-check-label small" for="dmsArchiveView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.archive.delete}
                                                                disabled={!data.permission.dex.dms.archive.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsArchiveDelete"
                                                            />
                                                            <label class="form-check-label small" for="dmsArchiveDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.trash.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsTrash"
                                                            />
                                                            <label class="form-check-label small" for="dmsTrash"><i class="bi bi-trash me-2"></i>Trash</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.trash.view}
                                                                disabled={!data.permission.dex.dms.trash.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsTrashView"
                                                            />
                                                            <label class="form-check-label small" for="dmsTrashView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.trash.restore}
                                                                disabled={!data.permission.dex.dms.trash.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsTrashRestore"
                                                            />
                                                            <label class="form-check-label small" for="dmsTrashRestore">Restore</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dms.trash.permanently_delete}
                                                                disabled={!data.permission.dex.dms.trash.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dmsTrashPermaDelete"
                                                            />
                                                            <label class="form-check-label small" for="dmsTrashPermaDelete">Permanently Delete</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td class="small">Tracking</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.incoming.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsIncoming"
                                                            />
                                                            <label class="form-check-label small" for="dtsIncoming"><i class="bi bi-box-arrow-in-down me-2"></i>Incoming</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.incoming.view}
                                                                disabled={!data.permission.dex.dts.incoming.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsIncomingView"
                                                            />
                                                            <label class="form-check-label small" for="dtsIncomingView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.incoming.reject}
                                                                disabled={!data.permission.dex.dts.incoming.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsIncomingReject"
                                                            />
                                                            <label class="form-check-label small" for="dtsIncomingReject">Reject</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.incoming.acknowledge}
                                                                disabled={!data.permission.dex.dts.incoming.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsIncomingAck"
                                                            />
                                                            <label class="form-check-label small" for="dtsIncomingAck">Acknowledge</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.inbox.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsInbox"
                                                            />
                                                            <label class="form-check-label small" for="dtsInbox"><i class="bi bi-inbox me-2"></i>Inbox</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.inbox.view}
                                                                disabled={!data.permission.dex.dts.inbox.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsInboxView"
                                                            />
                                                            <label class="form-check-label small" for="dtsInboxView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.inbox.retrieve}
                                                                disabled={!data.permission.dex.dts.inbox.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsInboxRetrieve"
                                                            />
                                                            <label class="form-check-label small" for="dtsInboxRetrieve">Retrieve</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.inbox.forward}
                                                                disabled={!data.permission.dex.dts.inbox.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsInboxForward"
                                                            />
                                                            <label class="form-check-label small" for="dtsInboxForward">Forward</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.inbox.terminate}
                                                                disabled={!data.permission.dex.dts.inbox.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsInboxTerminate"
                                                            />
                                                            <label class="form-check-label small" for="dtsInboxTerminate">Terminate</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.outgoing.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsOutgoing"
                                                            />
                                                            <label class="form-check-label small" for="dtsOutgoing"><i class="bi bi-send me-2"></i>Outgoing</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.outgoing.view}
                                                                disabled={!data.permission.dex.dts.outgoing.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsOutgoingView"
                                                            />
                                                            <label class="form-check-label small" for="dtsOutgoingView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.outgoing.recall}
                                                                disabled={!data.permission.dex.dts.outgoing.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsOutgoingRecall"
                                                            />
                                                            <label class="form-check-label small" for="dtsOutgoingRecall">Recall</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.drafts.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsDrafts"
                                                            />
                                                            <label class="form-check-label small" for="dtsDrafts"><i class="bi bi-file-earmark-text me-2"></i>Drafts</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.drafts.view}
                                                                disabled={!data.permission.dex.dts.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsDraftsView"
                                                            />
                                                            <label class="form-check-label small" for="dtsDraftsView">View</label>
                                                        </div>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.drafts.post}
                                                                disabled={!data.permission.dex.dts.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsDraftsPost"
                                                            />
                                                            <label class="form-check-label small" for="dtsDraftsPost">Post</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.drafts.create}
                                                                disabled={!data.permission.dex.dts.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsDraftsCreate"
                                                            />
                                                            <label class="form-check-label small" for="dtsDraftsCreate">Create</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.drafts.edit}
                                                                disabled={!data.permission.dex.dts.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsDraftsEdit"
                                                            />
                                                            <label class="form-check-label small" for="dtsDraftsEdit">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.drafts.delete}
                                                                disabled={!data.permission.dex.dts.drafts.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsDraftsDelete"
                                                            />
                                                            <label class="form-check-label small" for="dtsDraftsDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.broadcast_inbox.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsBroadcast"
                                                            />
                                                            <label class="form-check-label small" for="dtsBroadcast"><i class="bi bi-megaphone me-2"></i>Broadcast Inbox</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.broadcast_inbox.view}
                                                                disabled={!data.permission.dex.dts.broadcast_inbox.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsBroadcastView"
                                                            />
                                                            <label class="form-check-label small" for="dtsBroadcastView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.broadcast_inbox.retrieve}
                                                                disabled={!data.permission.dex.dts.broadcast_inbox.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsBroadcastRetrieve"
                                                            />
                                                            <label class="form-check-label small" for="dtsBroadcastRetrieve">Retrieve</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.archive.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsArchive"
                                                            />
                                                            <label class="form-check-label small" for="dtsArchive"><i class="bi bi-archive me-2"></i>Archive</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.archive.view}
                                                                disabled={!data.permission.dex.dts.archive.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsArchiveView"
                                                            />
                                                            <label class="form-check-label small" for="dtsArchiveView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.archive.retrieve}
                                                                disabled={!data.permission.dex.dts.archive.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsArchiveRetrieve"
                                                            />
                                                            <label class="form-check-label small" for="dtsArchiveRetrieve">Retrieve</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.archive.delete}
                                                                disabled={!data.permission.dex.dts.archive.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsArchiveDelete"
                                                            />
                                                            <label class="form-check-label small" for="dtsArchiveDelete">Delete</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.trash.access}
                                                                disabled={!data.permission.dex.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsTrash"
                                                            />
                                                            <label class="form-check-label small" for="dtsTrash"><i class="bi bi-trash me-2"></i>Trash</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.trash.view}
                                                                disabled={!data.permission.dex.dts.trash.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsTrashView"
                                                            />
                                                            <label class="form-check-label small" for="dtsTrashView">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.trash.restore}
                                                                disabled={!data.permission.dex.dts.trash.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsTrashRestore"
                                                            />
                                                            <label class="form-check-label small" for="dtsTrashRestore">Restore</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input
                                                                bind:checked={data.permission.dex.dts.trash.permanently_delete}
                                                                disabled={!data.permission.dex.dts.trash.access}
                                                                class="form-check-input"
                                                                type="checkbox"
                                                                id="dtsTrashPermaDelete"
                                                            />
                                                            <label class="form-check-label small" for="dtsTrashPermaDelete">Permanently Delete</label>
                                                        </div>
                                                    </td>
                                                    <td></td>
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
