<script>
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';

    let auth = $state();

    let updatingSignature = $state(false);

    let canvasEl;
    let signPad;

    // onmount
    onMount(() => {
        initSignPad();
    });

    // init sign pad
    function initSignPad() {
        // Initialize SignPad after canvas is mounted
        signPad = new App.SignPad(canvasEl);

        // Cleanup
        onDestroy(() => {
            signPad = null; // dereference
        });
    }

    // clear canvas
    function clearCanvas() {
        signPad.ClearCanvas();
    }

    // update signature
    async function updateSignature() {
        // validate canvas
        if (!signPad.Valid(1)) {
            Alert.show('error', 'Update failed.', 'Signature empty or might be too little.');
            return;
        }

        // update signature
        try {
            // password auth
            if (!(await auth.confirm())) return;

            updatingSignature = true;

            const file = await signPad.SaveAsPNG('signature');

            const formData = new FormData();
            formData.append('signature', file);

            const result = await App.API.post('/settings/signature/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto('/settings');
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Update failed.', result.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            updatingSignature = false;
        }
    }
</script>

<Auth bind:me={auth} warning="You are about to update your signature." />

<j.Row centerx>
    <j.Col span="8">
        <!-- controls -->
        <j.RowCol>
            <nav style="--bs-breadcrumb-divider: '>';">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item small"><a href="/settings">Settings</a></li>
                    <li class="breadcrumb-item small active">Sign Pad</li>
                </ol>
            </nav>
        </j.RowCol>

        <!-- signature -->
        <j.Card>
            <j.RowCol>
                <h5>Signature</h5>
                <p class="small">Please sign inside the designated area.</p>
            </j.RowCol>
            <j.RowCol centerx>
                <div style="position: relative;">
                    <div style="position: absolute; top:100px ; pointer-events: none; width: 300px; height: 200px;">
                        <hr class="mb-0 mx-auto" width="80%;" />
                        <p class="text-center text-secondary small">( sign here )</p>
                    </div>
                </div>
                <canvas id="myCanvas" width="300" height="200" class="border border-secondary-subtle" bind:this={canvasEl}> </canvas>
            </j.RowCol>
            <j.RowCol endx>
                <div class="d-flex gap-2">
                    <j.Button label="Clear" variant="light" onClick={clearCanvas} />
                    <j.Button
                        label="Cancel"
                        variant="light"
                        onClick={() => {
                            goto('/settings');
                        }}
                    />
                    <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={updatingSignature} onClick={updateSignature} />
                </div>
            </j.RowCol>
        </j.Card>
    </j.Col>
</j.Row>
