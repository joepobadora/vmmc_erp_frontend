<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import z from 'zod';

    let division = $state('');
    let abbreviation = $state('');
    let department = $state('');
    let office = $state('');
    let status = $state(true);

    let saving = $state(false);

    let errors = $state({});

    const schema = z.object({
        division: z.string().nonempty('Required.'),
        abbreviation: z.string().nonempty('Required.'),
        department: z.string().nonempty('Required.'),
    });

    async function save() {
        const validate = schema.safeParse({
            division,
            abbreviation,
            department,
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

            const result = await App.API.post('/admin/offices/store', {
                division: division,
                abbreviation: abbreviation,
                department: department,
                office: office,
                status: status,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto('/admin/offices');
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

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item"><a href="/admin/offices">Offices</a></li>
                        <li class="breadcrumb-item active">Add</li>
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
                            <h5>Add new office</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Office</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="password" class="form-label small">Division<span class="ms-1 text-danger">*</span></label>
                                <input
                                    bind:value={division}
                                    oninput={(e) => (division = e.target.value.toUpperCase())}
                                    type="text"
                                    class="form-control form-control-sm {errors.division ? 'is-invalid' : ''}"
                                    id="password"
                                    placeholder="Division"
                                />
                                <p class="text-danger small mb-auto {errors.division ? '' : 'd-none'}">{errors.division?.[0]}</p>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Department<span class="ms-1 text-danger">*</span></label>
                                <input
                                    bind:value={department}
                                    oninput={(e) => (department = e.target.value.toUpperCase())}
                                    type="text"
                                    class="form-control form-control-sm {errors.department ? 'is-invalid' : ''}"
                                    id="username"
                                    placeholder="Department"
                                />
                                <p class="text-danger small mb-auto {errors.department ? '' : 'd-none'}">{errors.department?.[0]}</p>
                            </div>
                            <div class="col-12 col-sm-3">
                                <label for="confirmPassword" class="form-label small">Dept. Abbreviation<span class="ms-1 text-danger">*</span></label>
                                <input
                                    bind:value={abbreviation}
                                    oninput={(e) => (abbreviation = e.target.value.toUpperCase())}
                                    type="text"
                                    class="form-control form-control-sm {errors.abbreviation ? 'is-invalid' : ''}"
                                    id="confirmPassword"
                                    placeholder="Abbreviation"
                                />
                                <p class="text-danger small mb-auto {errors.abbreviation ? '' : 'd-none'}">{errors.abbreviation?.[0]}</p>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office</label>
                                <input bind:value={office} oninput={(e) => (office = e.target.value.toUpperCase())} type="text" class="form-control form-control-sm" id="office" placeholder="Office" />
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
                            <a href="/admin/offices"> <button type="button" class="btn btn-light border btn-sm px-3 me-3 {saving == true ? 'd-none' : ''}">Cancel</button></a>
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
