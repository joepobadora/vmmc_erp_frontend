<script>
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

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
            updatingSignature = true;

            const result = await App.API.post('/settings/signature/update', {
                signature: signPad.SaveAsBase64(),
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
            <j.Row centerx>
                <j.Col auto>
                    <div style="position: relative;">
                        <div style="position: absolute; top:100px ; pointer-events: none; width: 300px; height: 200px;">
                            <hr class="mb-0 mx-auto" width="80%;" />
                            <p class="text-center text-secondary small">( sign here )</p>
                        </div>
                    </div>
                    <canvas id="myCanvas" width="300" height="200" class="border border-secondary-subtle" bind:this={canvasEl}> </canvas>
                </j.Col>
            </j.Row>
            <j.Row endx>
                <j.Col auto>
                    <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={updatingSignature} onClick={updateSignature} />
                </j.Col>
            </j.Row>
        </j.Card>
    </j.Col>
</j.Row>
