<script>
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';
    import z from 'zod';

    let { data } = $props();

    let username = $state(data.username ?? '');
    let firstName = $state(data.firstName ?? '');
    let middleName = $state(data.middleName ?? '');
    let lastName = $state(data.lastName ?? '');
    let suffixList = $state(data.suffixList ?? []);
    let suffix = $state(Number(data.suffix) ?? 0);
    let gender = $state(data.gender ?? '');
    let birthdate = $state(data.birthdate ?? '');

    let oldPassword = $state('');
    let newPassword = $state('');
    let confirmNewPassword = $state('');

    let updatingAccount = $state(false);
    let updatingPersonalInfo = $state(false);
    let loadingSignatureImage = $state(false);

    let imgSrc = $state('');

    let errors = $state({});

    const accountSchema = z
        .object({
            oldPassword: z.string().nonempty('Required.'),
            newPassword: z.string().nonempty('Required.'),
            confirmNewPassword: z.string().nonempty('Required.'),
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: 'Passwords do not match.',
            path: ['confirmNewPassword'],
        });

    const personalInfoSchema = z.object({
        firstName: z.string().nonempty('Required.'),
        lastName: z.string().nonempty('Required.'),
        birthdate: z.coerce.date('Required').max(new Date(), 'Must not be in the future.'),
    });

    // onmount
    onMount(() => {
        initSignature();
    });

    // init signature
    async function initSignature() {
        loadingSignatureImage = true;

        try {
            const result = await App.API.get('/settings/signature', {
                responseType: 'blob',
            });

            // Convert blob to an object URL to display in <img>
            const url = URL.createObjectURL(result.data);

            imgSrc = url;
        } catch (err) {
            console.log(err.message + ': UNABLE TO RETRIEVE FILE');
        } finally {
            loadingSignatureImage = false;
        }
    }

    // update account
    async function updateAccount() {
        const validate = accountSchema.safeParse({
            oldPassword,
            newPassword,
            confirmNewPassword,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        // validate old password
        try {
            const result = await App.API.post('/settings/validate-old-password', {
                old_password: oldPassword,
            });

            if (!result.data.success) {
                errors = {
                    oldPassword: ['Wrong old password.'],
                };
                return;
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }

        // update account
        try {
            // udpate button state
            updatingAccount = true;

            const result = await App.API.post('/settings/account/update', {
                new_password: newPassword,
            });

            if (result.data.success) {
                setTimeout(() => {
                    oldPassword = '';
                    newPassword = '';
                    confirmNewPassword = '';
                    goto('/settings', { invalidateAll: true });

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
            updatingAccount = false;
        }
    }

    // update personal information
    async function updatePersonalInfo() {
        const validate = personalInfoSchema.safeParse({
            firstName,
            lastName,
            birthdate,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        // update personal information
        try {
            // udpate button state
            updatingPersonalInfo = true;

            const result = await App.API.post('/settings/user/update', {
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                suffix: suffix,
                birthdate: birthdate,
                gender: gender,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto('/settings', { invalidateAll: true });

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
            updatingPersonalInfo = false;
        }
    }
</script>

<j.Row centerx>
    <j.Col span="8">
        <!-- controls -->
        <j.RowCol>
            <nav style="--bs-breadcrumb-divider: '>';">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item small active">Settings</li>
                </ol>
            </nav>
        </j.RowCol>
        <!-- account -->
        <j.Card>
            <j.RowCol>
                <h5>Account</h5>
                <p class="small">Change your account password to help keep your access secure. Make sure to choose a strong password that only you know.</p>
            </j.RowCol>
            <j.RowCol>
                <label for="username" class="form-label small">Username</label>
                <input type="text" class="form-control form-control-sm" id="username" placeholder="Username" bind:value={username} readonly />
            </j.RowCol>
            <j.Row>
                <j.Col span="4">
                    <label for="oldPassword" class="form-label small">Old Password<span class="ms-1 text-danger">*</span></label>
                    <input type="password" class="form-control form-control-sm {errors.oldPassword ? 'is-invalid' : ''}" id="oldPassword" placeholder="Old password" bind:value={oldPassword} />
                    <p class="text-danger small mb-auto {errors.oldPassword ? '' : 'd-none'}">{errors.oldPassword?.[0]}</p>
                </j.Col>
                <j.Col span="4">
                    <label for="newPassword" class="form-label small">New Password<span class="ms-1 text-danger">*</span></label>
                    <input type="password" class="form-control form-control-sm {errors.newPassword ? 'is-invalid' : ''}" id="newPassword" placeholder="New password" bind:value={newPassword} />
                    <p class="text-danger small mb-auto {errors.newPassword ? '' : 'd-none'}">{errors.newPassword?.[0]}</p>
                </j.Col>
                <j.Col span="4">
                    <label for="confirmNewPassword" class="form-label small">Confirm New Password<span class="ms-1 text-danger">*</span></label>
                    <input
                        type="password"
                        class="form-control form-control-sm {errors.confirmNewPassword ? 'is-invalid' : ''}"
                        id="confirmNewPassword"
                        placeholder="Confirm new password"
                        bind:value={confirmNewPassword}
                    />
                    <p class="text-danger small mb-auto {errors.confirmNewPassword ? '' : 'd-none'}">{errors.confirmNewPassword?.[0]}</p>
                </j.Col>
            </j.Row>
            <j.Row endx>
                <j.Col auto>
                    <j.Button label="Update" loadinglabel="Updating" icon="bi-arrow-repeat" loading={updatingAccount} onClick={updateAccount} />
                </j.Col>
            </j.Row>
        </j.Card>

        <!-- personal information -->
        <j.Card>
            <j.RowCol>
                <h5>Personal Information</h5>
                <p class="small">Update your basic details such as your name, gender, and birthdate. This information is used within the system to keep your profile accurate.</p>
            </j.RowCol>
            <j.RowCol>
                <label for="username" class="form-label small">Username</label>
                <input type="text" class="form-control form-control-sm" id="username" placeholder="Username" bind:value={username} readonly />
            </j.RowCol>
            <j.Row>
                <j.Col span="3">
                    <label for="firstName" class="form-label small">First Name<span class="ms-1 text-danger">*</span></label>
                    <input type="text" class="form-control form-control-sm {errors.firstName ? 'is-invalid' : ''}" id="firstName" placeholder="First name" bind:value={firstName} />
                    <p class="text-danger small mb-auto {errors.firstName ? '' : 'd-none'}">{errors.firstName?.[0]}</p>
                </j.Col>
                <j.Col span="3">
                    <label for="middleName" class="form-label small">Middle Name</label>
                    <input type="text" class="form-control form-control-sm" id="middleName" placeholder="Middle name" bind:value={middleName} />
                </j.Col>
                <j.Col span="3">
                    <label for="lastName" class="form-label small">Last Name<span class="ms-1 text-danger">*</span></label>
                    <input type="text" class="form-control form-control-sm {errors.lastName ? 'is-invalid' : ''}" id="lastName" placeholder="Last name" bind:value={lastName} />
                    <p class="text-danger small mb-auto {errors.lastName ? '' : 'd-none'}">{errors.lastName?.[0]}</p>
                </j.Col>
                <j.Col span="3">
                    <label for="suffix" class="form-label small">Suffix</label>
                    <select class="form-select form-select-sm" id="suffix" bind:value={suffix}>
                        <option value={0} selected>N/A</option>
                        {#each suffixList as suffix}
                            <option value={suffix.id}>{suffix.enumeration}</option>
                        {/each}
                    </select>
                </j.Col>
            </j.Row>
            <j.Row>
                <j.Col span="3">
                    <label for="male" class="form-label small">Gender</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="male" value="Male" bind:group={gender} />
                            <label class="form-check-label" for="male">Male</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="female" value="Female" bind:group={gender} />
                            <label class="form-check-label" for="female">Female</label>
                        </div>
                    </div>
                </j.Col>
                <j.Col span="3">
                    <label for="birthdate" class="form-label small">Birthdate<span class="ms-1 text-danger">*</span></label>
                    <input type="date" class="form-control form-control-sm {errors.birthdate ? 'is-invalid' : ''}" id="birthdate" bind:value={birthdate} />
                    <p class="text-danger small mb-auto {errors.birthdate ? '' : 'd-none'}">{errors.birthdate?.[0]}</p>
                </j.Col>
            </j.Row>
            <j.Row endx>
                <j.Col auto>
                    <j.Button label="Update" loadinglabel="Updating" icon="bi-arrow-repeat" loading={updatingPersonalInfo} onClick={updatePersonalInfo} />
                </j.Col>
            </j.Row>
        </j.Card>

        <!-- signature -->
        <j.Card>
            <j.RowCol>
                <h5>Signature</h5>
                <p class="small">Set your official signature details as they will appear on documents and records that require your authorization.</p>
            </j.RowCol>
            <j.Row centerx>
                <j.Col auto>
                    {#if loadingSignatureImage}
                        <div class="d-flex justify-content-center align-items-center border border-secondary-subtle" style="width: 300px; height: 200px;">
                            <div class="spinner-border text-secondary"></div>
                        </div>
                    {:else}
                        <img src={imgSrc} alt="" width="300" height="200" class="border border-secondary-subtle" />
                    {/if}
                </j.Col>
            </j.Row>
            <j.Row endx>
                <j.Col auto>
                    <j.Button label="Open Sign Pad" variant="outline-primary" icon="bi-box-arrow-up-right" href="/settings/sign-pad" />
                </j.Col>
            </j.Row>
        </j.Card>
    </j.Col>
</j.Row>
