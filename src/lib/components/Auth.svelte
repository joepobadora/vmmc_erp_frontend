<script>
    import { fade, fly } from 'svelte/transition';
    import { Alert } from '$lib/stores/alert';
    import App from '$lib/assets/js/bootstrap';
    import z from 'zod';
    import j from '$lib/components/helper';

    let { me = $bindable(), warning = '78675cc176081372c43abab3ea9fb70c74381eb02dc6e93fb6d44d161da6eeb3' } = $props();

    me = {
        confirm: () => {
            show = true;
            return new Promise((resolve) => (resolver = resolve));
        },
    };

    let show = $state(false);
    let resolver = $state(null);

    let password = $state('');
    let passIcon = $state('bi-eye-slash-fill');
    let passType = $state('password');

    let passInput;

    let authenticating = $state(false);

    let errors = $state({});

    const schema = z.object({
        password: z.string().nonempty('Required'),
    });

    async function HandleSubmit(e) {
        e.preventDefault();

        const validate = schema.safeParse({
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
            authenticating = true;

            const result = await App.API.post('/auth-password', {
                password: password,
            });

            const data = result.data.data;

            if (result.data.success) {
                setTimeout(() => {
                    resolver(true);
                    show = false;
                    // Alert.show('success', 'Authentication success.', result.data.success_code);
                }, 600);
            } else {
                Alert.show('error', 'Authentication failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            authenticating = false;
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

    // simulate onmount
    $effect(() => {
        if (show == true) {
            errors = {};
            passType = 'password';
            password = '';
            passInput.focus();
        }
    });
</script>

{#if show == true}
    <!-- Auth Modal -->
    <div class="modal fade show d-block" id="logoutModal" data-bs-backdrop="static" transition:fly={{ y: -200, duration: 450 }}>
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <j.Row endx mb="1">
                        <j.Col auto>
                            <button
                                type="button"
                                class="btn-close btn-sm"
                                onclick={() => {
                                    resolver(false);
                                    show = false;
                                }}
                            ></button>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="4">
                        <j.Col auto>
                            <i class="bi bi-shield-lock-fill fs-1 text-primary"></i>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="0">
                        <j.Col auto>
                            <h5>Confirm Your Identity</h5>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="0">
                        <j.Col auto>
                            <p class="mb-2 small text-danger">{warning}</p>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx>
                        <j.Col auto>
                            <p class="small text-muted mb-3">For your security, please re-enter your password to continue.</p>
                        </j.Col>
                    </j.Row>
                    <form onsubmit={HandleSubmit}>
                        <j.Row centerx>
                            <j.Col span="8">
                                <div class="input-group input-group-sm">
                                    <input
                                        type={passType}
                                        class="form-control {errors.password ? 'is-invalid' : ''}"
                                        placeholder="Password"
                                        name="passwordInput"
                                        bind:value={password}
                                        bind:this={passInput}
                                    />
                                    <button class="btn border border-start-0" type="button" id="button-addon2" aria-label="toggle password visibility" onclick={TogglePasswordVisibility}>
                                        <i class="bi {passIcon} text-secondary"></i>
                                    </button>
                                </div>
                                <p class="text-danger small mb-auto {errors.password ? '' : 'd-none'}">{errors.password?.[0]}</p>
                            </j.Col>
                        </j.Row>
                        <j.Row centerx>
                            <j.Col span="8">
                                <button type="submit" class="btn btn-primary btn-sm px-3 w-100 w-sm-auto" disabled={authenticating}>
                                    {#if authenticating}
                                        <span class="spinner-border spinner-border-sm me-2"></span>
                                        Authenticating...
                                    {:else}
                                        <i class="bi bi-chevron-right me-2"></i>
                                        Authenticate
                                    {/if}
                                </button>
                            </j.Col>
                        </j.Row>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal-backdrop fade show" transition:fade={{ duration: 150 }}></div>
{/if}
