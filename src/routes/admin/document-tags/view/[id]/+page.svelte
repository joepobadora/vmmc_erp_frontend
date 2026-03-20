<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import j from '$lib/components/helper';
    import App from '$lib/assets/js/bootstrap';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);

    let name = $state(data.documentTag.name ?? '');
    let office = $state(data.documentTag.office ?? '');
    let color = $state(data.documentTag.color ?? '#2980b9');
    let status = $state(data.documentTag.status ?? true);

    const p = new App.ParamBuilder(page.url.searchParams);
</script>

<j.RowCol>
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/document-tags{p.toString()}">Document Tags</a></li>
            <li class="breadcrumb-item small active">View</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>View document tag</h5>
        <p class="small text-muted">
            A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Document Tag</h5>
    <j.Row>
        <j.Col span="6">
            <label for="username" class="form-label small">Tag</label>
            <input bind:value={name} type="text" class="form-control form-control-sm" id="username" disabled />
        </j.Col>
        <j.Col span="6">
            <label for="office" class="form-label small">Office</label>
            <input bind:value={office} list="officeList" type="text" class="form-control form-control-sm" id="office" disabled />
            <datalist id="officeList">
                {#each officeList as office}
                    <option value={office.short_name}></option>
                {/each}
            </datalist>
        </j.Col>
    </j.Row>
    <j.RowCol span="6">
        <label for="username" class="form-label small">Color</label>
        <div class="input-group input-group-sm">
            <input bind:value={color} type="text" class="form-control form-control-sm" id="username" disabled />
            <div class="p-1 border">
                <input bind:value={color} type="color" class="h-100 border-0" placeholder="#ffffff" name="passwordInput" id="colorselector" disabled />
            </div>
        </div>
    </j.RowCol>
    <j.RowCol>
        <label for="status" class="form-label small">Status</label>
        <div>
            <span class="badge bg-{status == true ? 'success' : 'danger'}">{status == true ? 'Active' : 'Inactive'}</span>
        </div>
    </j.RowCol>
    <j.RowCol endx>
        <button
            type="button"
            class="btn btn-primary btn-sm px-3"
            onclick={() => {
                goto(`/admin/document-tags${p.toString()}`);
            }}>Okay</button
        >
    </j.RowCol>
</j.Card>
