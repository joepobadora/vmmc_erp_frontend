<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';
    import { page } from '$app/state';
    import Auth from '$lib/components/Auth.svelte';

    let auth = $state();

    let name = $state('');
    let status = $state(true);

    let saving = $state(false);

    let errors = $state({});

    const schema = z.object({
        name: z.string().nonempty('Required.'),
    });

    async function save() {
        const validate = schema.safeParse({
            name,
        });

        if (!validate.success) {
            errors = validate.error.flatten().fieldErrors;
            return;
        } else {
            errors = {};
        }

        // update personal information
        try {
            // password auth
            if ((await auth.confirm()) == false) {
                return;
            }

            // udpate button state
            saving = true;

            const result = await App.API.post('/admin/document-types/store', {
                name: name,
                status: status,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/document-types?page=${page.url.searchParams.get('page')}`);
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
            saving = false;
        }
    }
</script>

<Auth bind:me={auth} />

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item small"><a href="/admin/document-types?page={page.url.searchParams.get('page')}">Document Types</a></li>
                        <li class="breadcrumb-item small active">Add</li>
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
                            <h5>Add new document type</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Document Type</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="password" class="form-label small">Type</label>
                                <input
                                    bind:value={name}
                                    oninput={(e) => (name = e.target.value.toUpperCase())}
                                    type="text"
                                    class="form-control form-control-sm {errors.name ? 'is-invalid' : ''}"
                                    id="password"
                                    placeholder="Document type"
                                />
                                <p class="text-danger small mb-auto {errors.name ? '' : 'd-none'}">{errors.name?.[0]}</p>
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <label for="status" class="form-label small">Status</label>
                                <div class="form-check form-switch">
                                    <input bind:checked={status} class="form-check-input" type="checkbox" id="status" />
                                    <label class="form-check-label small" for="status">Active</label>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <button
                                type="button"
                                class="btn btn-light border btn-sm px-3 me-3 {saving == true ? 'd-none' : ''}"
                                onclick={() => {
                                    goto(`/admin/document-types?page=${page.url.searchParams.get('page')}`);
                                }}>Cancel</button
                            >
                            <button onclick={save} disabled={saving} type="button" class="btn btn-primary btn-sm px-3">
                                {#if saving}
                                    <span class="spinner-border spinner-border-sm me-2"></span>
                                    Saving...
                                {:else}
                                    <i class="bi bi-check-lg me-2"></i>
                                    Save
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
