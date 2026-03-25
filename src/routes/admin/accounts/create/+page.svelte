<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';
    import Auth from '$lib/components/Auth.svelte';
    import j from '$lib/components/helper';

    let auth = $state();

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);
    let suffixList = $state(data.suffixList ?? []);
    let roleList = $state(data.roleList ?? []);

    let account = $state({
        username: '',
        password: '',
        confirm_password: '',
        status: true,
        office: '',
        role: 0,
    });

    let user = $state({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix_id: 0,
        gender: '',
        birthdate: '',
    });

    let modules = $state({
        ADMIN0: false, // admin
        ADMIN1: false, // accounts
        ADMIN2: false, // roles
        ADMIN3: false, // offices
        ADMIN4: false, // doc types
        ADMIN5: false, // doc tags
        ADMIN6: false, // audit trail
        DEX0: false, // dex
        DEX1: false, // dms documents
        DEX2: false, // dms ref copies
        DEX3: false, // dms drafts
        DEX4: false, // dms archive
        DEX5: false, // dms trash
        DEX6: false, // dts incoming
        DEX7: false, // dts inbox
        DEX8: false, // dts outgoing
        DEX9: false, // dts drafts
        DEX10: false, // dts broadcast
        DEX11: false, // dts archive
        DEX12: false, // dts trash
        SEND0: false, // send
        FORMS0: false, // forms
    });

    let saving = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z
        .object({
            username: z.string().nonempty('Required.'),
            password: z.string().nonempty('Required.'),
            confirm_password: z.string().nonempty('Required.'),
            office: z
                .string()
                .nonempty('Required.')
                .refine((val) => officeList.map((s) => s.short_name).includes(val), {
                    message: 'Invalid office selected.',
                }),
            first_name: z.string().nonempty('Required.'),
            last_name: z.string().nonempty('Required.'),
            gender: z.string().nonempty('Required.'),
            birthdate: z.coerce.date('Required').max(new Date(), 'Must not be in the future.'),
            role: z.number().min(1, 'Required'),
        })
        .refine((data) => data.password === data.confirm_password, {
            message: 'Passwords do not match.',
            path: ['confirm_password'],
        });

    async function save() {
        const { username, password, confirm_password, office, role } = account;
        const { first_name, last_name, gender, birthdate } = user;

        const validate = schema.safeParse({
            username,
            password,
            confirm_password,
            office,
            first_name,
            last_name,
            gender,
            birthdate,
            role,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        // saving account
        try {
            // password auth
            if (!(await auth.confirm())) return;

            // udpate button state
            saving = true;

            const result = await App.API.post('/admin/accounts/store', {
                account: account,
                user: user,
                modules: modules,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/accounts${p.toString()}`);
                    Alert.show('success', 'Saving success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Saving failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            saving = false;
        }
    }

    $effect(() => {
        if (!modules.DEX0) {
            modules.DEX1 = false; // dms documents
            modules.DEX2 = false; // dms ref copies
            modules.DEX3 = false; // dms drafts
            modules.DEX4 = false; // dms archive
            modules.DEX5 = false; // dms trash
            modules.DEX6 = false; // dts incoming
            modules.DEX7 = false; // dts inbox
            modules.DEX8 = false; // dts outgoing
            modules.DEX9 = false; // dts drafts
            modules.DEX10 = false; // dts broadcast
            modules.DEX11 = false; // dts archive
            modules.DEX12 = false; // dts trash
        }
        if (!modules.ADMIN0) {
            modules.ADMIN1 = false; // accounts
            modules.ADMIN2 = false; // roles
            modules.ADMIN3 = false; // offices
            modules.ADMIN4 = false; // doc types
            modules.ADMIN5 = false; // doc tags
            modules.ADMIN6 = false; // audit trail
        }
    });
</script>

<Auth bind:me={auth} warning="You are about to create an account." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/accounts{p.toString()}">Accounts</a></li>
            <li class="breadcrumb-item small active">Create</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Create new user account</h5>
        <p class="small">A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.</p>
    </j.RowCol>

    <hr class="text-muted" />
    <h5>Account</h5>

    <j.Row>
        <j.Col span="6">
            <label for="username" class="form-label small">Username<span class="ms-1 text-danger">*</span></label>
            <input bind:value={account.username} type="text" class="form-control form-control-sm {errors.username ? 'is-invalid' : ''}" id="username" placeholder="Username" />
            <p class="text-danger small mb-auto {errors.username ? '' : 'd-none'}">{errors.username?.[0]}</p>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
            <label for="password" class="form-label small">Password<span class="ms-1 text-danger">*</span></label>
            <input bind:value={account.password} type="password" class="form-control form-control-sm {errors.password ? 'is-invalid' : ''}" id="password" placeholder="Password" />
            <p class="text-danger small mb-auto {errors.password ? '' : 'd-none'}">{errors.password?.[0]}</p>
        </j.Col>
        <j.Col span="6">
            <label for="confirmPassword" class="form-label small">Confirm Password<span class="ms-1 text-danger">*</span></label>
            <input
                bind:value={account.confirm_password}
                type="password"
                class="form-control form-control-sm {errors.confirm_password ? 'is-invalid' : ''}"
                id="confirmPassword"
                placeholder="Confirm password"
            />
            <p class="text-danger small mb-auto {errors.confirm_password ? '' : 'd-none'}">{errors.confirm_password?.[0]}</p>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Office<span class="ms-1 text-danger">*</span></label>
            <input bind:value={account.office} list="officeList" type="text" class="form-control form-control-sm {errors.office ? 'is-invalid' : ''}" id="office" placeholder="Office" />
            <p class="text-danger small mb-auto {errors.office ? '' : 'd-none'}">{errors.office?.[0]}</p>
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office.short_name}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
            <label for="status" class="form-label small">Status</label>
            <div class="form-check form-switch">
                <input bind:checked={account.status} class="form-check-input" type="checkbox" id="status" />
                <label class="form-check-label small" for="status">Active</label>
            </div>
        </j.Col>
    </j.Row>
    <hr class="text-muted" />
    <h5>Personal Info</h5>

    <j.Row>
        <j.Col span="3">
            <label for="firstName" class="form-label small">First Name<span class="ms-1 text-danger">*</span></label>
            <input bind:value={user.first_name} type="text" class="form-control form-control-sm {errors.first_name ? 'is-invalid' : ''}" id="firstName" placeholder="First name" />
            <p class="text-danger small mb-auto {errors.first_name ? '' : 'd-none'}">{errors.first_name?.[0]}</p>
        </j.Col>
        <j.Col span="3">
            <label for="middleName" class="form-label small">Middle Name</label>
            <input bind:value={user.middle_name} type="text" class="form-control form-control-sm" id="middleName" placeholder="Middle name" />
        </j.Col>
        <j.Col span="3">
            <label for="exampleFormControlInput1" class="form-label small">Last Name<span class="ms-1 text-danger">*</span></label>
            <input bind:value={user.last_name} type="text" class="form-control form-control-sm {errors.last_name ? 'is-invalid' : ''}" id="exampleFormControlInput1" placeholder="Last name" />
            <p class="text-danger small mb-auto {errors.last_name ? '' : 'd-none'}">{errors.last_name?.[0]}</p>
        </j.Col>
        <j.Col span="3">
            <label for="suffix" class="form-label small">Suffix</label>
            <select bind:value={user.suffix_id} class="form-select form-select-sm" id="suffix">
                <option value={0} selected>N/A</option>
                {#each suffixList as suffix}
                    <option value={suffix.id}>{suffix.enumeration}</option>
                {/each}
            </select>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="3">
            <label for="gender" class="form-label small">Gender<span class="ms-1 text-danger">*</span></label>
            <div>
                <div class="form-check form-check-inline">
                    <input bind:group={user.gender} class="form-check-input {errors.gender ? 'is-invalid' : ''}" type="radio" name="inlineRadioOptions" id="male" value="Male" />
                    <label class="form-check-label small" for="male">Male</label>
                </div>
                <div class="form-check form-check-inline">
                    <input bind:group={user.gender} class="form-check-input {errors.gender ? 'is-invalid' : ''}" type="radio" name="inlineRadioOptions" id="female" value="Female" />
                    <label class="form-check-label small" for="female">Female</label>
                </div>
            </div>
            <p class="text-danger small mb-auto {errors.gender ? '' : 'd-none'}">{errors.gender?.[0]}</p>
        </j.Col>
        <j.Col span="3">
            <label for="birthdate" class="form-label small">Birthdate<span class="ms-1 text-danger">*</span></label>
            <input bind:value={user.birthdate} type="date" class="form-control form-control-sm {errors.birthdate ? 'is-invalid' : ''}" id="birthdate" />
            <p class="text-danger small mb-auto {errors.birthdate ? '' : 'd-none'}">{errors.birthdate?.[0]}</p>
        </j.Col>
    </j.Row>
    <hr class="text-muted" />
    <h5>Access</h5>
    <j.Row>
        <j.Col span="6">
            <label for="suffix" class="form-label small">Role<span class="ms-1 text-danger">*</span></label>
            <select bind:value={account.role} class="form-select form-select-sm {errors.role ? 'is-invalid' : ''}" id="role">
                {#each roleList as role}
                    <option value={role.id}>{role.name}</option>
                {/each}
            </select>
            <p class="text-danger small mb-auto {errors.role ? '' : 'd-none'}">{errors.role?.[0]}</p>
        </j.Col>
    </j.Row>
    <j.RowCol>
        <label for="modules" class="form-label small">Modules</label>
        <table class="table" id="modules">
            <tbody>
                <tr>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.DEX0} class="form-check-input" type="checkbox" id="dex" />
                            <label class="form-check-label small" for="dex"><i class="bi bi-diagram-3 me-2"></i>DEx</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.DEX1} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dmsDocuments" />
                            <label class="form-check-label small" for="dmsDocuments">Documents</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX4} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dmsArchive" />
                            <label class="form-check-label small" for="dmsArchive">Archive</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX9} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsDrafts" />
                            <label class="form-check-label small" for="dtsDrafts">Drafts <span class="fst-italic">(Tracker)</span></label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.DEX2} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dmsReferenceCopies" />
                            <label class="form-check-label small" for="dmsReferenceCopies">Reference Copies</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX6} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsIncoming" />
                            <label class="form-check-label small" for="dtsIncoming">Incoming <span class="fst-italic">(Tracker)</span></label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX10} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsBroadcastInbox" />
                            <label class="form-check-label small" for="dtsBroadcastInbox">Broadcast Inbox <span class="fst-italic">(Tracker)</span></label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.DEX3} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dmsDrafts" />
                            <label class="form-check-label small" for="dmsDrafts">Drafts</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX7} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsInbox" />
                            <label class="form-check-label small" for="dtsInbox">Inbox <span class="fst-italic">(Tracker)</span></label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX11} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsArchive" />
                            <label class="form-check-label small" for="dtsArchive">Archive <span class="fst-italic">(Tracker)</span></label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.DEX5} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dmsTrash" />
                            <label class="form-check-label small" for="dmsTrash">Trash</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX8} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsOutgoing" />
                            <label class="form-check-label small" for="dtsOutgoing">Outgoing <span class="fst-italic">(Tracker)</span></label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.DEX12} disabled={!modules.DEX0} class="form-check-input" type="checkbox" id="dtsTrash" />
                            <label class="form-check-label small" for="dtsTrash">Trash <span class="fst-italic">(Tracker)</span></label>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.SEND0} class="form-check-input" type="checkbox" id="send" />
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
                            <input bind:checked={modules.FORMS0} class="form-check-input" type="checkbox" id="forms" />
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
                            <input bind:checked={modules.ADMIN0} class="form-check-input" type="checkbox" id="admin" />
                            <label class="form-check-label small" for="admin"><i class="bi bi-shield-lock me-2"></i>Admin Console</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.ADMIN1} disabled={!modules.ADMIN0} class="form-check-input" type="checkbox" id="adminAccounts" />
                            <label class="form-check-label small" for="adminAccounts">Accounts</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.ADMIN5} disabled={!modules.ADMIN0} class="form-check-input" type="checkbox" id="adminDocTags" />
                            <label class="form-check-label small" for="adminDocTags">Document Tags</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.ADMIN2} disabled={!modules.ADMIN0} class="form-check-input" type="checkbox" id="adminRoles" />
                            <label class="form-check-label small" for="adminRoles">Roles</label>
                        </div>
                        <div class="form-check">
                            <input bind:checked={modules.ADMIN6} disabled={!modules.ADMIN0} class="form-check-input" type="checkbox" id="adminAuditTrail" />
                            <label class="form-check-label small" for="adminAuditTrail">Audit Trail</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.ADMIN3} disabled={!modules.ADMIN0} class="form-check-input" type="checkbox" id="adminOffices" />
                            <label class="form-check-label small" for="adminOffices">Offices</label>
                        </div>
                    </td>
                    <td>
                        <div class="form-check">
                            <input bind:checked={modules.ADMIN4} disabled={!modules.ADMIN0} class="form-check-input" type="checkbox" id="adminDocTypes" />
                            <label class="form-check-label small" for="adminDocTypes">Document Types</label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </j.RowCol>
    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/admin/accounts${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
</j.Card>
