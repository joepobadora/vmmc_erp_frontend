<script>
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';

    let username = $state('');
    let firstName = $state('');
    let middleName = $state('');
    let lastName = $state('');
    let suffixList = $state([]);
    let suffix = $state('');
    let gender = $state('');
    let birthdate = $state('');

    let oldPassword = $state('');
    let newPassword = $state('');
    let confirmNewPassword = $state('');

    let validOldPassword = $state(true);
    let validNewPasswords = $state(true);
    let validFirstName = $state(true);
    let validLastName = $state(true);
    let validBirthdate = $state(true);

    let updatingAccount = $state(false);
    let updatingPersonalInfo = $state(false);
    let loadingSignatureImage = $state(false);

    let imgSrc = $state('');

    // onmount
    onMount(() => {
        init();
        initSignature();
    });

    // init form
    async function init() {
        try {
            const result = await App.API.get('/settings');

            if (result.success) {
                username = result.data.account.username;
                oldPassword = '';
                newPassword = '';
                confirmNewPassword = '';
                firstName = result.data.user.first_name;
                middleName = result.data.user.middle_name;
                lastName = result.data.user.last_name;
                suffixList = result.data.suffix_list;
                suffix = result.data.user.suffix ?? 'N/A';
                gender = result.data.user.gender;
                birthdate = App.Format.date(result.data.user.birthdate).toISODate();
            } else {
                Alert.show('error', 'Request failed.', result.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    }

    // init signature
    async function initSignature() {
        loadingSignatureImage = true;

        try {
            const blob = await App.API.get('/file/show-signature', 'blob');

            // Convert blob to an object URL to display in <img>
            const url = URL.createObjectURL(blob);

            imgSrc = url;
        } catch (err) {
            console.log(err.message + ': UNABLE TO RETRIEVE FILE');
        } finally {
            loadingSignatureImage = false;
        }
    }

    // update account
    async function updateAccount() {
        // require
        if (!App.Validator.value(oldPassword).required()) {
            validOldPassword = false;
            Alert.show('error', 'Update failed.', 'Old password required.');
            return;
        } else {
            validOldPassword = true;
        }
        if (!App.Validator.value(newPassword).required()) {
            validNewPasswords = false;
            Alert.show('error', 'Update failed.', 'New password required.');
            return;
        } else {
            validNewPasswords = true;
        }

        // validate old password
        try {
            const result = await App.API.post('/settings/validate-old-password', {
                old_password: oldPassword,
            });

            if (!result.success) {
                validOldPassword = false;
                Alert.show('error', 'Update failed.', result.error_code);
                return;
            } else {
                validOldPassword = true;
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }

        // validate new passwords if match
        if (!App.Validator.value(newPassword).match(confirmNewPassword)) {
            validNewPasswords = false;
            Alert.show('error', 'Update failed.', 'New passwords do not match.');
            return;
        } else {
            validNewPasswords = true;
        }

        // update account
        try {
            // udpate button state
            updatingAccount = true;

            const result = await App.API.post('/settings/account/update', {
                new_password: newPassword,
            });

            if (result.success) {
                setTimeout(() => {
                    init();

                    updatingAccount = false;
                    Alert.show('success', 'Update success.', result.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    updatingAccount = false;
                    Alert.show('error', 'Update failed.', result.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    }

    // update personal information
    async function updatePersonalInfo() {
        // require
        if (!App.Validator.value(firstName).required()) {
            validFirstName = false;
            Alert.show('error', 'Update failed.', 'First name required.');
            return;
        } else {
            validFirstName = true;
        }
        if (!App.Validator.value(lastName).required()) {
            validLastName = false;
            Alert.show('error', 'Update failed.', 'Last name required.');
            return;
        } else {
            validLastName = true;
        }
        if (!App.Validator.value(birthdate).required()) {
            validBirthdate = false;
            Alert.show('error', 'Update failed.', 'Birthdate required.');
            return;
        } else {
            validBirthdate = true;
        }

        // ensure birthdate is not in the future
        if (App.Validator.value(birthdate).isAfter(new Date())) {
            validBirthdate = false;
            Alert.show('error', 'Update failed.', 'Birthdate must not be in the future.');
            return;
        } else {
            validBirthdate = true;
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

            if (result.success) {
                setTimeout(() => {
                    init();

                    updatingPersonalInfo = false;
                    Alert.show('success', 'Update success.', result.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    updatingPersonalInfo = false;
                    Alert.show('error', 'Update failed.', result.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    }
</script>

<div class="row justify-content-center">
    <div class="col-12 col-sm-8">
        <!-- account -->
        <div class="card shadow-sm border-0 p-2 mb-4">
            <div class="card-body">
                <div class="mb-4">
                    <h5>Account</h5>
                    <p class="small">Change your account password to help keep your access secure. Make sure to choose a strong password that only you know.</p>
                </div>
                <div class="mb-3">
                    <label for="username" class="form-label small">Username</label>
                    <input type="text" class="form-control form-control-sm" id="username" placeholder="Username" bind:value={username} readonly />
                </div>
                <div class="row mb-4">
                    <div class="col-12 col-sm-4 mb-3">
                        <label for="oldPassword" class="form-label small">Old Password</label>
                        <input type="password" class="form-control form-control-sm {!validOldPassword ? 'is-invalid' : ''}" id="oldPassword" placeholder="Old password" bind:value={oldPassword} />
                    </div>
                    <div class="col-12 col-sm-4 mb-3">
                        <label for="newPassword" class="form-label small">New Password</label>
                        <input type="password" class="form-control form-control-sm {!validNewPasswords ? 'is-invalid' : ''}" id="newPassword" placeholder="New password" bind:value={newPassword} />
                    </div>
                    <div class="col-12 col-sm-4">
                        <label for="confirmNewPassword" class="form-label small">Confirm New Password</label>
                        <input
                            type="password"
                            class="form-control form-control-sm {!validNewPasswords ? 'is-invalid' : ''}"
                            id="confirmNewPassword"
                            placeholder="Confirm new password"
                            bind:value={confirmNewPassword}
                        />
                    </div>
                </div>
                <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                    <button type="button" class="btn btn-primary btn-sm px-3" onclick={updateAccount} disabled={updatingAccount}>
                        {#if updatingAccount}
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                        {:else}
                            <i class="bi bi-arrow-repeat me-2"></i>
                            Update
                        {/if}
                    </button>
                </div>
            </div>
        </div>
        <!-- personal information -->
        <div class="card border-0 shadow-sm p-2 mb-4">
            <div class="card-body">
                <div class="mb-4">
                    <h5>Personal Information</h5>
                    <p class="small">Update your basic details such as your name, gender, and birthdate. This information is used within the system to keep your profile accurate.</p>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col-12 col-sm-3 mb-3">
                            <label for="firstName" class="form-label small">First Name</label>
                            <input type="text" class="form-control form-control-sm {!validFirstName ? 'is-invalid' : ''}" id="firstName" placeholder="First name" bind:value={firstName} />
                        </div>
                        <div class="col-12 col-sm-3 mb-3">
                            <label for="middleName" class="form-label small">Middle Name</label>
                            <input type="text" class="form-control form-control-sm" id="middleName" placeholder="Middle name" bind:value={middleName} />
                        </div>
                        <div class="col-12 col-sm-3 mb-3">
                            <label for="lastName" class="form-label small">Last Name</label>
                            <input type="text" class="form-control form-control-sm {!validLastName ? 'is-invalid' : ''}" id="lastName" placeholder="Last name" bind:value={lastName} />
                        </div>
                        <div class="col-12 col-sm-3">
                            <label for="suffix" class="form-label small">Suffix</label>
                            <select class="form-select form-select-sm" id="suffix" bind:value={suffix}>
                                <option value="N/A" selected>N/A</option>
                                {#each suffixList as suffix}
                                    <option value={suffix}>{suffix}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="row">
                        <div class="col-12 col-sm-3 mb-3">
                            <label for="male" class="form-label small">Gender</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="male" value="MALE" bind:group={gender} />
                                    <label class="form-check-label" for="male">Male</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="female" value="FEMALE" bind:group={gender} />
                                    <label class="form-check-label" for="female">Female</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-3">
                            <label for="birthdate" class="form-label small">Birthdate</label>
                            <input type="date" class="form-control form-control-sm {!validBirthdate ? 'is-invalid' : ''}" id="birthdate" bind:value={birthdate} />
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                    <button type="button" class="btn btn-primary btn-sm px-3" onclick={updatePersonalInfo} disabled={updatingPersonalInfo}>
                        {#if updatingPersonalInfo}
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                        {:else}
                            <i class="bi bi-arrow-repeat me-2"></i>
                            Update
                        {/if}
                    </button>
                </div>
            </div>
        </div>
        <!-- signature -->
        <div class="card border-0 shadow-sm p-2 mb-4">
            <div class="card-body">
                <div class="mb-4">
                    <h5>Signature</h5>
                    <p class="small">Set your official signature details as they will appear on documents and records that require your authorization.</p>
                </div>
                <div class="mb-4">
                    <div class="row justify-content-center">
                        <div class="col-auto mb-3">
                            {#if loadingSignatureImage}
                                <div class="d-flex justify-content-center align-items-center border border-secondary-subtle" style="width: 300px; height: 200px;">
                                    <div class="spinner-border text-secondary"></div>
                                </div>
                            {:else}
                                <img src={imgSrc} alt="" width="300" height="200" class="border border-secondary-subtle" />
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                    <a href="/settings/sign-pad" class="btn btn-light border btn-sm px-3">Open Sign Pad<i class="bi bi-box-arrow-up-right ms-2"></i></a>
                </div>
            </div>
        </div>
    </div>
</div>
