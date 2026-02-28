<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import z from 'zod';

    const { data } = $props();

    let name = $state(data.name ?? '');
    let status = $state(data.status ?? true);

    let saving = $state(false);
    let deleting = $state(false);

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
            // udpate button state
            saving = true;

            const result = await App.API.post(`/admin/document-types/update/${page.params.id}`, {
                name: name,
                status: status,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto('/admin/document-types');
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

    async function destroy() {
        try {
            // udpate button state
            deleting = true;

            const result = await App.API.post(`/admin/document-types/destroy/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto('/admin/document-types');
                    Alert.show('success', 'Deletion success.', result.data.success_code);
                }, 600);
            } else {
                setTimeout(() => {
                    Alert.show('error', 'Deletion failed.', result.data.error_code);
                }, 600);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            deleting = false;
        }
    }
</script>

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item"><a href="/admin/document-types">Document Types</a></li>
                        <li class="breadcrumb-item active">Edit</li>
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
                            <h5>Edit document type</h5>
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
                                    class="form-control form-control-sm"
                                    id="password"
                                    placeholder="Document type"
                                />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="status" class="form-label small">Status</label>
                                <div class="form-check form-switch">
                                    <input bind:checked={status} class="form-check-input" type="checkbox" id="status" />
                                    <label class="form-check-label small" for="status">Active</label>
                                </div>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Maintenance</h5>
                        <div class="row mb-4">
                            <div class="col">
                                <label for="password" class="form-label small">Document Type</label>
                                <div>
                                    <button onclick={destroy} disabled={deleting} type="button" class="btn btn-danger btn-sm px-3">
                                        {#if deleting}
                                            <span class="spinner-border spinner-border-sm me-2"></span>
                                            Deleting...
                                        {:else}
                                            <i class="bi bi-x-lg me-2"></i>
                                            Delete Type
                                        {/if}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <a href="/admin/document-types"> <button type="button" class="btn btn-light border btn-sm px-3 me-3">Cancel</button></a>
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
