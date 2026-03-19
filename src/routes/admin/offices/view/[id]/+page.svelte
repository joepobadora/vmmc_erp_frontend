<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import j from '$lib/components/helper';

    let { data } = $props();

    let division = $state(data.division ?? '');
    let abbreviation = $state(data.abbreviation ?? '');
    let department = $state(data.department ?? '');
    let office = $state(data.office ?? '');
    let status = $state(data.status ?? false);
</script>

<!-- controls -->
<j.RowCol>
    <!-- breadcrumbs -->
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/offices?page={page.url.searchParams.get('page')}">Offices</a></li>
            <li class="breadcrumb-item small active">View</li>
        </ol>
    </nav>
</j.RowCol>
<j.Card>
    <j.RowCol>
        <h5>View office</h5>
        <p class="small text-muted">
            A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Office</h5>
    <j.RowCol span="6">
        <label for="password" class="form-label small">Division</label>
        <input bind:value={division} type="text" class="form-control form-control-sm" id="password" disabled />
    </j.RowCol>
    <j.Row>
        <j.Col span="6">
            <label for="username" class="form-label small">Department</label>
            <input bind:value={department} type="text" class="form-control form-control-sm" id="username" disabled />
        </j.Col>
        <j.Col span="3">
            <label for="confirmPassword" class="form-label small">Dept. Abbreviation</label>
            <input bind:value={abbreviation} type="text" class="form-control form-control-sm" id="confirmPassword" disabled />
        </j.Col>
    </j.Row>
    <j.RowCol span="6">
        <label for="office" class="form-label small">Office</label>
        <input bind:value={office} type="text" class="form-control form-control-sm" id="office" disabled />
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
                goto(`/admin/offices?page=${page.url.searchParams.get('page')}`);
            }}>Okay</button
        >
    </j.RowCol>
</j.Card>
