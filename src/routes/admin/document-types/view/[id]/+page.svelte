<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import j from '$lib/components/helper';
    import App from '$lib/assets/js/bootstrap';

    const { data } = $props();

    let name = $state(data.name ?? '');
    let status = $state(data.status ?? true);

    const p = new App.ParamBuilder(page.url.searchParams);
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/document-types{p.toString()}">Document Types</a></li>
            <li class="breadcrumb-item small active">View</li>
        </ol>
    </nav>
</j.RowCol>

<j.Card>
    <j.RowCol>
        <h5>View document type</h5>
        <p class="small text-muted">
            A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Document Type</h5>
    <j.RowCol span="6">
        <label for="password" class="form-label small">Type</label>
        <input bind:value={name} type="text" class="form-control form-control-sm" id="password" disabled />
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
                goto(`/admin/document-types${p.toString()}`);
            }}>Okay</button
        >
    </j.RowCol>
</j.Card>
