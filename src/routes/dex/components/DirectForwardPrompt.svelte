<script>
    import { fade, fly } from 'svelte/transition';
    import { Alert } from '$lib/stores/alert';
    import App from '$lib/assets/js/bootstrap';
    import z from 'zod';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';

    let { me = $bindable(), tranId = 0, tranNo = '' } = $props();

    let auth = $state();

    me = {
        confirm: () => {
            show = true;
            return new Promise((resolve) => (resolver = resolve));
        },
    };

    let show = $state(false);
    let resolver = $state(null);

    let directOffice = $state('');
    let officeList = $state([]);

    let forwarding = $state(false);

    let errors = $state({});

    const schema = z.object({
        directOffice: z
            .string()
            .nonempty('Required.')
            .refine((val) => officeList.map((s) => s.short_name).includes(val), {
                message: 'Invalid office selected.',
            }),
    });

    async function HandleSubmit(e) {
        e.preventDefault();

        const validate = schema.safeParse({
            directOffice,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        try {
            // password auth
            show = false;
            if (!(await auth.confirm())) {
                show = true;
                return;
            }

            // udpate button state
            forwarding = true;

            const result = await App.API.post(`/dex/dts/inbox/forward/${tranId}`, {
                direct_office: directOffice,
            });

            const data = result.data.data;

            if (result.data.success) {
                setTimeout(() => {
                    resolver(true);
                    show = false;

                    Alert.show('success', 'Forwarding success.', result.data.success_code);
                }, 600);
            } else {
                Alert.show('error', 'Forwarding failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            forwarding = false;
        }
    }

    // simulate onmount
    // load dropdown list
    $effect(async () => {
        if (show == true) {
            try {
                const result = await App.API.get('/dex/dts/inbox/dropdown');

                const data = result.data.data;

                if (result.data.success) {
                    officeList = data;
                }
            } catch (err) {
                Alert.show('error', 'Bad request.', err.message);
            }
        }
    });

    function testClose() {
        show = false;
    }
</script>

<Auth bind:me={auth} warning="Authenticate" />

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
                            <i class="bi bi-send fs-1 text-primary"></i>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="0">
                        <j.Col auto>
                            <h5>{tranNo}</h5>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="0">
                        <j.Col auto>
                            <p class="mb-2 small text-danger">You are about to directly forward a transaction.</p>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="4">
                        <j.Col span="8">
                            <label for="office" class="form-label small">Office<span class="ms-1 text-danger">*</span></label>
                            <input
                                bind:value={directOffice}
                                oninput={(e) => (directOffice = e.target.value.toUpperCase())}
                                list="officeList"
                                type="text"
                                class="form-control form-control-sm {errors.directOffice ? 'is-invalid' : ''}"
                                id="office"
                                placeholder="Office"
                            />
                            <p class="text-danger small mb-auto {errors.directOffice ? '' : 'd-none'}">{errors.directOffice?.[0]}</p>
                            <datalist id="officeList">
                                {#each officeList as office}
                                    <option value={office.short_name}></option>
                                {/each}
                            </datalist>
                        </j.Col>
                    </j.Row>

                    <form onsubmit={HandleSubmit}>
                        <j.Row centerx>
                            <j.Col span="8">
                                <button type="submit" class="btn btn-primary btn-sm px-3 w-100 w-sm-auto" disabled={forwarding}>
                                    {#if forwarding}
                                        <span class="spinner-border spinner-border-sm me-2"></span>
                                        Forwarding...
                                    {:else}
                                        <i class="bi bi-chevron-right me-2"></i>
                                        Forward
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
