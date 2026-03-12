<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);
    let suffixList = $state(data.suffixList ?? []);
    let roleList = $state(data.roleList ?? []);

    let account = $state(data.account ?? {});
    let user = $state(data.account.user ?? {});
    let modules = $state(data.modules ?? {});

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
                        <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item small"><a href="/admin/accounts?page={page.url.searchParams.get('page')}">Accounts</a></li>
                        <li class="breadcrumb-item small active">View</li>
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
                            <h5>View user account</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Account</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Username</label>
                                <input bind:value={account.username} type="text" class="form-control form-control-sm" id="username" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office</label>
                                <input bind:value={account.office} list="officeList" type="text" class="form-control form-control-sm" id="office" disabled />
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
                                <div>
                                    <span class="badge bg-{account.is_active == true ? 'success' : 'danger'}">{account.is_active == true ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Personal Info</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-3">
                                <label for="firstName" class="form-label small">First Name</label>
                                <input bind:value={user.first_name} type="text" class="form-control form-control-sm" id="firstName" disabled />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="middleName" class="form-label small">Middle Name</label>
                                <input bind:value={user.middle_name} type="text" class="form-control form-control-sm" id="middleName" disabled />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="exampleFormControlInput1" class="form-label small">Last Name</label>
                                <input bind:value={user.last_name} type="text" class="form-control form-control-sm" id="exampleFormControlInput1" disabled />
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="suffix" class="form-label small">Suffix</label>
                                <select bind:value={user.suffix_id} class="form-select form-select-sm" id="suffix" disabled>
                                    <option value={0} selected>N/A</option>
                                    {#each suffixList as suffix}
                                        <option value={suffix.id}>{suffix.enumeration}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-3">
                                <label for="gender" class="form-label small">Gender</label>
                                <div>
                                    <span class="badge bg-secondary">{account.user.gender}</span>
                                </div>
                            </div>
                            <div class="col-12 col-md-3">
                                <label for="birthdate" class="form-label small">Birthdate</label>
                                <input bind:value={user.birthdate} type="date" class="form-control form-control-sm" id="birthdate" disabled />
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Access</h5>
                        <div class="row mb-4">
                            <div class="col-12 col-sm-6">
                                <label for="suffix" class="form-label small">Role</label>
                                <select bind:value={account.role_id} class="form-select form-select-sm" id="role" disabled>
                                    {#each roleList as role}
                                        <option value={role.id}>{role.name}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col">
                                <label for="modules" class="form-label small">Modules</label>
                                <table class="table" id="modules">
                                    <tbody>
                                        <!-- svelte-ignore component_name_lowercase -->
                                        <tr>
                                            <td>
                                                <div class="small"><i class="bi {modules.DEX0 == true ? checked : unchecked} me-2"></i>DEx</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.DEX1 == true ? checked : unchecked} me-2"></i>Documents</div>
                                                <div class="small"><i class="bi {modules.DEX4 == true ? checked : unchecked} me-2"></i>Archive</div>
                                                <div class="small"><i class="bi {modules.DEX9 == true ? checked : unchecked} me-2"></i>Drafts <span class="fst-italic">(Tracker)</span></div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.DEX2 == true ? checked : unchecked} me-2"></i>Reference Copies</div>
                                                <div class="small"><i class="bi {modules.DEX6 == true ? checked : unchecked} me-2"></i>Incoming <span class="fst-italic">(Tracker)</span></div>
                                                <div class="small"><i class="bi {modules.DEX10 == true ? checked : unchecked} me-2"></i>Broadcast Inbox <span class="fst-italic">(Tracker)</span></div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.DEX3 == true ? checked : unchecked} me-2"></i>Drafts</div>
                                                <div class="small"><i class="bi {modules.DEX7 == true ? checked : unchecked} me-2"></i>Inbox <span class="fst-italic">(Tracker)</span></div>
                                                <div class="small"><i class="bi {modules.DEX11 == true ? checked : unchecked} me-2"></i>Archive <span class="fst-italic">(Tracker)</span></div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.DEX5 == true ? checked : unchecked} me-2"></i>Trash</div>
                                                <div class="small"><i class="bi {modules.DEX8 == true ? checked : unchecked} me-2"></i>Outgoing <span class="fst-italic">(Tracker)</span></div>
                                                <div class="small"><i class="bi {modules.DEX12 == true ? checked : unchecked} me-2"></i>Trash <span class="fst-italic">(Tracker)</span></div>
                                            </td>
                                        </tr>
                                        <!-- svelte-ignore component_name_lowercase -->
                                        <tr>
                                            <td>
                                                <div class="small"><i class="bi {modules.SEND0 == true ? checked : unchecked} me-2"></i>SendIt</div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <!-- svelte-ignore component_name_lowercase -->
                                        <tr>
                                            <td>
                                                <div class="small"><i class="bi {modules.FORMS0 == true ? checked : unchecked} me-2"></i>FormsHub</div>
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <!-- svelte-ignore component_name_lowercase -->
                                        <tr>
                                            <td>
                                                <div class="small"><i class="bi {modules.ADMIN0 == true ? checked : unchecked} me-2"></i>Admin Console</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.ADMIN1 == true ? checked : unchecked} me-2"></i>Accounts</div>
                                                <div class="small"><i class="bi {modules.ADMIN5 == true ? checked : unchecked} me-2"></i>Document Tags</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.ADMIN2 == true ? checked : unchecked} me-2"></i>Roles</div>
                                                <div class="small"><i class="bi {modules.ADMIN6 == true ? checked : unchecked} me-2"></i>Audit Trail</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.ADMIN3 == true ? checked : unchecked} me-2"></i>Offices</div>
                                            </td>
                                            <td>
                                                <div class="small"><i class="bi {modules.ADMIN4 == true ? checked : unchecked} me-2"></i>Document Types</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <button
                                type="button"
                                class="btn btn-primary btn-sm px-3"
                                onclick={() => {
                                    goto(`/admin/accounts?page=${page.url.searchParams.get('page')}`);
                                }}>Okay</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
