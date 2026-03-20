<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import JSONDiff from '$lib/components/JSONDiff.svelte';
    import j from '$lib/components/helper';

    const { data } = $props();

    const p = new App.ParamBuilder(page.url.searchParams);
</script>

<j.RowCol>
    <nav style="--bs-breadcrumb-divider: '>';">
        <ol class="breadcrumb">
            <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
            <li class="breadcrumb-item small"><a href="/admin/audit-trail{p.toString()}">Audit Trail</a></li>
            <li class="breadcrumb-item small active">View</li>
        </ol>
    </nav>
</j.RowCol>
<j.Card>
    <j.RowCol>
        <h5>View log</h5>
        <p class="small text-muted">
            The audit trail allows administrators to track user activity within the ERP system. It records actions performed by users, including the module accessed, operations executed, and
            timestamps, providing a transparent history for security, compliance, and accountability purposes.
        </p>
    </j.RowCol>
    <hr class="text-muted" />
    <h5>Metadata</h5>
    <j.Row>
        <j.Col auto>
            <span class="small">Timestamp: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{App.Format.date(data.created_at).toMilliseconds()}</span>
        </j.Col>
    </j.Row>
    <hr class="text-muted" />
    <h5>Actor</h5>
    <j.Row mb="0">
        <j.Col auto>
            <span class="small">Name: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.full_name_2}</span>
        </j.Col>
    </j.Row>
    <j.Row mb="0">
        <j.Col auto>
            <span class="small">IP Address: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.ip_address}</span>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col auto>
            <span class="small">User Agent: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.user_agent}</span>
        </j.Col>
    </j.Row>
    <hr class="text-muted" />
    <h5>Entity</h5>
    <j.Row mb="0">
        <j.Col auto>
            <span class="small">Client Route: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.client_route}</span>
        </j.Col>
    </j.Row>
    <j.Row mb="0">
        <j.Col auto>
            <span class="small">Entity: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.entity}</span>
        </j.Col>
    </j.Row>
    <j.Row mb="0">
        <j.Col auto>
            <span class="small">Method: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.action_taken_snapshot}</span>
        </j.Col>
    </j.Row>
    <j.Row>
        <j.Col auto>
            <span class="small">Action Taken: </span>
        </j.Col>
        <j.Col auto>
            <span class="small">{data.details}</span>
        </j.Col>
    </j.Row>
    <hr class="text-muted" />
    <h5>Data Changes</h5>
    <j.RowCol>
        <div class="bg-light overflow-auto border mt-3 p-3" style="max-height: 600px;">
            <JSONDiff old_values={data.old_values} new_values={data.new_values} />
        </div>
    </j.RowCol>
    <j.RowCol endx>
        <button
            type="button"
            class="btn btn-primary btn-sm px-3"
            onclick={() => {
                goto(`/admin/audit-trail${p.toString()}`);
            }}>Okay</button
        >
    </j.RowCol>
</j.Card>
