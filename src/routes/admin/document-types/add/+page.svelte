<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import z from 'zod';
    import { page } from '$app/state';
    import j from '$lib/components/helper';
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
            if (!(await auth.confirm())) return;

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

<Auth bind:me={auth} warning="You are about to create a document type." />

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/document-types?page={page.url.searchParams.get('page')}">Document Types</a></li>
            <li class="breadcrumb-item small active">Add</li>
        </ol>
    </nav>
</j.RowCol>
<j.Card>
    <j.RowCol>
        <h5>Add new document type</h5>
        <p class="small text-muted">
            A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Document Type</h5>
    <j.RowCol span="6">
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
    </j.RowCol>
    <j.RowCol>
        <label for="status" class="form-label small">Status</label>
        <div class="form-check form-switch">
            <input bind:checked={status} class="form-check-input" type="checkbox" id="status" />
            <label class="form-check-label small" for="status">Active</label>
        </div>
    </j.RowCol>
    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/admin/document-types?page=${page.url.searchParams.get('page')}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
</j.Card>
