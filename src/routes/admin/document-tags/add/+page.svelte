<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';
    import { page } from '$app/state';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);

    let name = $state('');
    let office = $state('');
    let status = $state(true);

    let saving = $state(false);

    let errors = $state({});

    const schema = z.object({
        name: z.string().nonempty('Required.'),
        office: z
            .string()
            .nonempty('Required.')
            .refine((val) => officeList.map((s) => s.short_name).includes(val), {
                message: 'Invalid office selected.',
            }),
    });

    async function save() {
        const validate = schema.safeParse({
            name,
            office,
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

            const result = await App.API.post('/admin/document-tags/store', {
                name: name,
                office: office,
                status: status,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/document-tags?page=${page.url.searchParams.get('page')}`);
                    Alert.show('success', 'Update success.', result.data.success_code);
                }, 600);
            } else {
                console.log(result);
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

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item small"><a href="/admin/document-tags?page={page.url.searchParams.get('page')}">Document Tags</a></li>
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
                            <h5>Add new document tag</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Document Tag</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Tag<span class="ms-1 text-danger">*</span></label>
                                <input bind:value={name} type="text" class="form-control form-control-sm {errors.name ? 'is-invalid' : ''}" id="username" placeholder="Document tag" />
                                <p class="text-danger small mb-auto {errors.name ? '' : 'd-none'}">{errors.name?.[0]}</p>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office<span class="ms-1 text-danger">*</span></label>
                                <input bind:value={office} list="officeList" type="text" class="form-control form-control-sm {errors.office ? 'is-invalid' : ''}" id="office" placeholder="Office" />
                                <p class="text-danger small mb-auto {errors.office ? '' : 'd-none'}">{errors.office?.[0]}</p>
                                <datalist id="officeList">
                                    {#each officeList as office}
                                        <option value={office.short_name}></option>
                                    {/each}
                                </datalist>
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
</div>
