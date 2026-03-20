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

    let officeList = $state(data.officeList ?? []);

    let name = $state(data.documentTag.name ?? '');
    let office = $state(data.documentTag.office ?? '');
    let color = $state(data.documentTag.color ?? '#2980b9');
    let status = $state(data.documentTag.status ?? true);

    let saving = $state(false);
    let deleting = $state(false);

    let errors = $state({});

    const p = new App.ParamBuilder(page.url.searchParams);

    const schema = z.object({
        name: z.string().nonempty('Required.'),
        office: z
            .string()
            .nonempty('Required.')
            .refine((val) => officeList.map((s) => s.short_name).includes(val), {
                message: 'Invalid office selected.',
            }),
        color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            message: 'Invalid hex color.',
        }),
    });

    async function save() {
        const validate = schema.safeParse({
            name,
            office,
            color,
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

            const result = await App.API.post(`/admin/document-tags/update/${page.params.id}`, {
                name: name,
                office: office,
                color: color,
                status: status,
            });

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/document-tags${p.toString()}`);
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

    async function destroy() {
        try {
            // password auth
            if (!(await auth.confirm())) return;

            // udpate button state
            deleting = true;

            const result = await App.API.post(`/admin/document-tags/destroy/${page.params.id}`);

            if (result.data.success) {
                setTimeout(() => {
                    goto(`/admin/document-tags${p.toString()}`);
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

<Auth bind:me={auth} warning="You are about to update a document tag." />

<j.RowCol>
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/document-tags{p.toString()}">Document Tags</a></li>
            <li class="breadcrumb-item small active">Add</li>
        </ol>
    </nav>
</j.RowCol>
<j.Card>
    <j.RowCol>
        <h5>Edit document tag</h5>
        <p class="small text-muted">
            A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Document Tag</h5>
    <j.Row>
        <j.Col span="6">
            <label for="username" class="form-label small">Tag<span class="ms-1 text-danger">*</span></label>
            <input
                bind:value={name}
                oninput={(e) => (name = e.target.value.toUpperCase())}
                type="text"
                class="form-control form-control-sm {errors.name ? 'is-invalid' : ''}"
                id="username"
                placeholder="Document tag"
            />
            <p class="text-danger small mb-auto {errors.name ? '' : 'd-none'}">{errors.name?.[0]}</p>
        </j.Col>
        <j.Col span="6">
            <label for="office" class="form-label small">Office<span class="ms-1 text-danger">*</span></label>
            <input bind:value={office} list="officeList" type="text" class="form-control form-control-sm {errors.office ? 'is-invalid' : ''}" id="office" placeholder="Office" />
            <p class="text-danger small mb-auto {errors.office ? '' : 'd-none'}">{errors.office?.[0]}</p>
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office.short_name}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>
    <j.RowCol span="6">
        <label for="colorfield" class="form-label small">Color</label>
        <div class="input-group input-group-sm">
            <input bind:value={color} type="text" class="form-control {errors.color ? 'is-invalid' : ''}" placeholder="#ffffff" name="passwordInput" id="colorfield" />
            <div class="p-1 border">
                <input bind:value={color} type="color" class="h-100 border-0" placeholder="#ffffff" name="passwordInput" id="colorselector" />
            </div>
        </div>
        <p class="text-danger small mb-auto {errors.color ? '' : 'd-none'}">{errors.color?.[0]}</p>
    </j.RowCol>
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
        <label for="password" class="form-label small">Document Tag</label>
        <div>
            <j.Button label="Delete Tag" variant="danger" loadinglabel="Deleting" icon="bi-x-lg" loading={deleting} onClick={destroy} />
        </div>
    </j.RowCol>
    <j.RowCol endx>
        <div class="d-flex gap-2">
            <button
                type="button"
                class="btn btn-light border btn-sm px-3 {saving == true ? 'd-none' : ''}"
                onclick={() => {
                    goto(`/admin/document-tags${p.toString()}`);
                }}>Cancel</button
            >
            <j.Button label="Save" loadinglabel="Saving" icon="bi-check-lg" loading={saving} onClick={save} />
        </div>
    </j.RowCol>
</j.Card>
