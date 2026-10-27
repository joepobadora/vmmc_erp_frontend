<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { Alert } from '$lib/stores/alert';
    import App from '$lib/assets/js/bootstrap';
    import z from 'zod';
    import j from '$lib/components/helper';

    let username = $state('');
    let password = $state('');
    let rememberMe = $state(false);
    let passIcon = $state('bi-eye-slash-fill');
    let passType = $state('password');
    let userInput;
    let passInput;

    let loggingIn = $state(false);

    let errors = $state({});

    const schema = z.object({
        username: z.string().nonempty('Required'),
        password: z.string().nonempty('Required'),
    });

    onMount(() => {
        const stored = localStorage.getItem('username');
        if (stored) {
            username = stored;
            rememberMe = true;
            passInput.focus();
        } else {
            userInput.focus();
        }
    });

    async function HandleSubmit(e) {
        e.preventDefault();

        rememberMe && username ? localStorage.setItem('username', username) : localStorage.removeItem('username');

        const validate = schema.safeParse({
            username,
            password,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        try {
            // udpate button state
            loggingIn = true;

            const result = await App.API.post('/login', {
                username: username,
                password: password,
            });

            const data = result.data.data;

            if (result.data.success) {
                setTimeout(() => {
                    localStorage.setItem('access_token', data.token);
                    goto('/');
                    Alert.show('success', 'Login successful.', 'Welcome back, ' + data.user.first_name + '!');
                }, 600);
            } else {
                Alert.show('error', 'Login failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            loggingIn = false;
        }
    }

    function TogglePasswordVisibility() {
        if (passType === 'password') {
            passType = 'text';
            passIcon = 'bi-eye-fill';
        } else {
            passType = 'password';
            passIcon = 'bi-eye-slash-fill';
        }
    }
</script>

<div class="d-flex justify-content-center align-items-center" style:height="90%">
    <div style:min-width="375px">
        <j.Card>
            <j.RowCol centerx mb="2">
                <img class="mb-3" src="/vmmc_logo.png" alt="VMMC Logo" width="64px" height="64px" />
            </j.RowCol>
            <j.RowCol centerx mb="0">
                <h5>Sign in</h5>
            </j.RowCol>
            <j.RowCol centerx>
                <p>
                    Get access to you
                    <abbr title="Veterans Memorial Medical Center - Enterprise Resource Planning" class="initialism">VMMC ERP</abbr>
                    modules.
                </p>
            </j.RowCol>
            <form onsubmit={HandleSubmit}>
                <j.RowCol mb="2">
                    <input
                        type="text"
                        class="form-control form-control-sm {errors.username ? 'is-invalid' : ''}"
                        placeholder="Username"
                        name="usernameInput"
                        bind:value={username}
                        bind:this={userInput}
                    />
                    <p class="text-danger small mb-auto {errors.username ? '' : 'd-none'}">{errors.username?.[0]}</p>
                </j.RowCol>
                <j.RowCol>
                    <div class="input-group input-group-sm">
                        <input type={passType} class="form-control {errors.password ? 'is-invalid' : ''}" placeholder="Password" name="passwordInput" bind:value={password} bind:this={passInput} />
                        <button class="btn border border-start-0" type="button" id="button-addon2" aria-label="toggle password visibility" onclick={TogglePasswordVisibility}>
                            <i class="bi {passIcon} text-secondary"></i>
                        </button>
                    </div>
                    <p class="text-danger small mb-auto {errors.password ? '' : 'd-none'}">{errors.password?.[0]}</p>
                </j.RowCol>
                <j.RowCol>
                    <div class="form-check small">
                        <input class="form-check-input" type="checkbox" id="rememberMe" bind:checked={rememberMe} />
                        <label class="form-check-label text-primary" for="rememberMe">Remember me</label>
                    </div>
                </j.RowCol>
                <j.RowCol>
                    <button type="submit" class="btn btn-primary btn-sm px-3 w-100 w-sm-auto" disabled={loggingIn}>
                        {#if loggingIn}
                            <span class="spinner-border spinner-border-sm me-2"></span>
                            Logging in...
                        {:else}
                            <i class="bi bi-chevron-right me-2"></i>
                            Login
                        {/if}
                    </button>
                </j.RowCol>
            </form>
        </j.Card>
    </div>
</div>
