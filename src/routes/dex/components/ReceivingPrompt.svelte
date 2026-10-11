<script>
    import { fade, fly } from 'svelte/transition';
    import { Alert } from '$lib/stores/alert';
    import App from '$lib/assets/js/bootstrap';
    import z from 'zod';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';

    let { me = $bindable(), tranNo = '' } = $props();

    let auth = $state();

    me = {
        confirm: () => {
            show = true;
            return new Promise((resolve) => (resolver = resolve));
        },
    };

    let show = $state(false);
    let resolver = $state(null);

    let tranId = $state(0);
    let docNo = $state('');
    let name = $state('');
    let details = $state('');

    let receiving = $state(false);

    async function HandleSubmit(e) {
        e.preventDefault();

        try {
            // password auth
            show = false;
            if (!(await auth.confirm())) {
                show = true;
                return;
            }

            // udpate button state
            receiving = true;

            const result = await App.API.post(`/dex/dts/inbox/receive/${tranId}`, {
                transaction_no: tranNo,
            });

            const data = result.data.data;

            if (result.data.success) {
                setTimeout(() => {
                    resolver(true);
                    show = false;

                    Alert.show('success', 'Receiving success.', result.data.success_code);
                }, 600);
            } else {
                Alert.show('error', 'Receiving failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            receiving = false;
        }
    }

    // simulate onmount
    // load preview
    $effect(async () => {
        if (show == true) {
            try {
                // udpate button state
                receiving = true;

                const result = await App.API.post('/dex/dts/inbox/preview', {
                    transaction_no: tranNo,
                });

                const data = result.data.data;

                if (result.data.success) {
                    tranId = data.id;
                    docNo = data.document.document_no;
                    name = data.document.latest_version.name;
                } else {
                    Alert.show('error', 'Authentication failed.', result.data.error_code);
                }
            } catch (err) {
                Alert.show('error', 'Bad request.', err.message);
            } finally {
                receiving = false;
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
                            <i class="bi bi-receipt fs-1 text-primary"></i>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="0">
                        <j.Col auto>
                            <h5>{tranNo}</h5>
                        </j.Col>
                    </j.Row>
                    <j.Row centerx mb="0">
                        <j.Col auto>
                            <p class="mb-2 small text-danger">You are about to receive a transaction.</p>
                        </j.Col>
                    </j.Row>
                    <div class="px-3">
                        <j.RowCol>
                            <j.Row mb="0">
                                <j.Col span="3">
                                    <span class="small text-muted">Document No:</span>
                                </j.Col>
                                <j.Col>
                                    <span class="small">{docNo}</span>
                                </j.Col>
                            </j.Row>
                            <j.Row>
                                <j.Col span="3">
                                    <span class="small text-muted">Name:</span>
                                </j.Col>
                                <j.Col>
                                    <span class="small">{name}</span>
                                </j.Col>
                            </j.Row>
                        </j.RowCol>
                    </div>
                    <form onsubmit={HandleSubmit}>
                        <j.Row centerx>
                            <j.Col span="8">
                                <button type="submit" class="btn btn-primary btn-sm px-3 w-100 w-sm-auto" disabled={receiving}>
                                    {#if receiving}
                                        <span class="spinner-border spinner-border-sm me-2"></span>
                                        Receiving...
                                    {:else}
                                        <i class="bi bi-chevron-right me-2"></i>
                                        Receive
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
