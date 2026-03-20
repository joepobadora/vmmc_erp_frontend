<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';
    import j from '$lib/components/helper';
    import Auth from '$lib/components/Auth.svelte';

    let auth = $state();

    let { data } = $props();

    let division = $state(data.division ?? '');
    let abbreviation = $state(data.abbreviation ?? '');
    let department = $state(data.department ?? '');
    let office = $state(data.office ?? '');
    let status = $state(data.status ?? false);

    let saving = $state(false);
    let deleting = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

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
            // password auth
            if (!(await auth.confirm())) return;

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
                    goto(`/admin/offices${p.toString()}`);
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
            // password auth
            if (!(await auth.confirm())) return;

            // udpate button state
            deleting = true;

            const result = await App.API.post(`/admin/offices/destroy/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/offices${p.toString()}`);
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

<Auth bind:me={auth} warning="You are about to update an office." />

<j.RowCol>
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/offices{p.toString()}">Offices</a></li>
            <li class="breadcrumb-item small active">Edit</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>Edit office</h5>
        <p class="small text-muted">
            A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Office</h5>
    <j.Row>
        <j.Col span="6">
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
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
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
        </j.Col>
        <j.Col span="3">
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
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col span="6">
            <label for="office" class="form-label small">Office</label>
            <input bind:value={office} oninput={(e) => (office = e.target.value.toUpperCase())} type="text" class="form-control form-control-sm" id="office" placeholder="Office" />
        </j.Col>
    </j.Row>
    <j.RowCol>
        <label for="status" class="form-label small">Status</label>
        <div class="form-check form-switch">
            <input bind:checked={status} class="form-check-input" type="checkbox" id="status" />
            <label class="form-check-label small" for="status">Active</label>
        </div>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Maintenance</h5>
    <j.RowCol>
        <label for="password" class="form-label small">Office</label>
        <div>
            <j.Button label="Delete Office" variant="danger" loadinglabel="Deleting" icon="bi-x-lg" loading={deleting} onClick={destroy} />
        </div>
    </j.RowCol>
    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/admin/offices${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
</j.Card>
