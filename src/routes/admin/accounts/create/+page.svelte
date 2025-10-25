<script>
    let data = $state({
        account: {
            status: true,
        },
        user: {},
        module: {
            admin: {
                accounts: {},
                audit: {},
                offices: {},
                docTypes: {},
                docTags: {},
            },
        },
    });

    $effect(() => {
        // If Admin Console is disabled, turn off all submodules' access
        if (!data.module.admin.access) {
            for (const key in data.module.admin) {
                if (key !== 'access') {
                    data.module.admin[key].access = false;
                }
            }
        }

        // For each submodule, if access is disabled, turn off all its permissions
        for (const key in data.module.admin) {
            if (key !== 'access') {
                const submodule = data.module.admin[key];
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

    function showData() {
        console.log(JSON.stringify(data));
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
                                <input bind:value={data.account.confirmPassword} type="password" class="form-control form-control-sm" id="confirmPassword" placeholder="Confirm password" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office</label>
                                <input bind:value={data.account.office} type="text" class="form-control form-control-sm" id="office" placeholder="Office" />
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
                                <input bind:value={data.user.firstName} type="text" class="form-control form-control-sm" id="firstName" placeholder="First name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="middleName" class="form-label small">Middle Name</label>
                                <input bind:value={data.user.middleName} type="text" class="form-control form-control-sm" id="middleName" placeholder="Middle name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">Last Name</label>
                                <input bind:value={data.user.lastName} type="text" class="form-control form-control-sm" id="exampleFormControlInput1" placeholder="Last name" />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="suffix" class="form-label small">Suffix</label>
                                <select bind:value={data.user.suffix} class="form-select form-select-sm" id="suffix">
                                    <option value="NA" selected>N/A</option>
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
                                            <input bind:checked={data.module.admin.access} class="form-check-input" type="checkbox" role="switch" id="adminConsole" />
                                            <label class="form-check-label small" for="adminConsole">Admin Console</label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <table class="table">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.accounts.access} class="form-check-input" type="checkbox" id="accounts" />
                                                            <label class="form-check-label small" for="accounts">Accounts</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.accounts.view} class="form-check-input" type="checkbox" id="viewAccounts" />
                                                            <label class="form-check-label small" for="viewAccounts">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.accounts.edit} class="form-check-input" type="checkbox" id="editAccounts" />
                                                            <label class="form-check-label small" for="editAccounts">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.accounts.delete} class="form-check-input" type="checkbox" id="deleteAccounts" />
                                                            <label class="form-check-label small" for="deleteAccounts">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.audit.access} class="form-check-input" type="checkbox" id="auditTrail" />
                                                            <label class="form-check-label small" for="auditTrail">Audit Trail</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.audit.view} class="form-check-input" type="checkbox" id="viewAuditTrail" />
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
                                                            <input bind:checked={data.module.admin.offices.access} class="form-check-input" type="checkbox" id="offices" />
                                                            <label class="form-check-label small" for="offices">Offices</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.offices.view} class="form-check-input" type="checkbox" id="viewOffices" />
                                                            <label class="form-check-label small" for="viewOffices">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.offices.edit} class="form-check-input" type="checkbox" id="editOffices" />
                                                            <label class="form-check-label small" for="editOffices">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.offices.delete} class="form-check-input" type="checkbox" id="deleteOffices" />
                                                            <label class="form-check-label small" for="deleteOffices">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTypes.access} class="form-check-input" type="checkbox" id="documentTypes" />
                                                            <label class="form-check-label small" for="documentTypes">Document Types</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTypes.view} class="form-check-input" type="checkbox" id="viewDocumentTypes" />
                                                            <label class="form-check-label small" for="viewDocumentTypes">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTypes.edit} class="form-check-input" type="checkbox" id="editDocumentTypes" />
                                                            <label class="form-check-label small" for="editDocumentTypes">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTypes.delete} class="form-check-input" type="checkbox" id="deleteDocumentTypes" />
                                                            <label class="form-check-label small" for="deleteDocumentTypes">Delete</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTags.access} class="form-check-input" type="checkbox" id="documentTags" />
                                                            <label class="form-check-label small" for="documentTags">Document Tags</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTags.view} class="form-check-input" type="checkbox" id="viewDocumentTags" />
                                                            <label class="form-check-label small" for="viewDocumentTags">View</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTags.edit} class="form-check-input" type="checkbox" id="editDocumentTags" />
                                                            <label class="form-check-label small" for="editDocumentTags">Edit</label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="form-check">
                                                            <input bind:checked={data.module.admin.docTags.delete} class="form-check-input" type="checkbox" id="deleteDocumentTags" />
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
                            <button onclick={showData} type="button" class="btn btn-primary btn-sm px-3"><i class="bi bi-check2 me-2"></i>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
