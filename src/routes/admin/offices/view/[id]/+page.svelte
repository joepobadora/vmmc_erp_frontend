<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import z from 'zod';

    let { data } = $props();

    let division = $state(data.division ?? '');
    let abbreviation = $state(data.abbreviation ?? '');
    let department = $state(data.department ?? '');
    let office = $state(data.office ?? '');
    let status = $state(data.status ?? false);

    let saving = $state(false);
    let deleting = $state(false);

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

            const result = await App.API.post(`/admin/offices/update/${page.params.id}`, {
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

    async function destroy() {
        try {
            // udpate button state
            deleting = true;

            const result = await App.API.post(`/admin/offices/destroy/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto('/admin/offices');
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
                        <li class="breadcrumb-item"><a href="/admin/offices">Offices</a></li>
                        <li class="breadcrumb-item active">View</li>
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
                            <h5>View office</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Office</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="password" class="form-label small">Division</label>
                                <input bind:value={division} type="text" class="form-control form-control-sm" id="password" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Department</label>
                                <input bind:value={department} type="text" class="form-control form-control-sm" id="username" disabled />
                            </div>
                            <div class="col-12 col-sm-3">
                                <label for="confirmPassword" class="form-label small">Dept. Abbreviation</label>
                                <input bind:value={abbreviation} type="text" class="form-control form-control-sm" id="confirmPassword" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office</label>
                                <input bind:value={office} type="text" class="form-control form-control-sm" id="office" disabled />
                            </div>
                        </div>
                        <div class="row mb-4">
                            <div class="col-12 col-md-6">
                                <label for="status" class="form-label small">Status</label>
                                <div>
                                    <span class="badge bg-{status == true ? 'success' : 'danger'}">{status == true ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <a href="/admin/offices"> <button type="button" class="btn btn-primary btn-sm px-3">Okay</button></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
