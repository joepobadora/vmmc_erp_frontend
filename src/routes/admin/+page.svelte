<script>
    import App from '$lib/assets/js/bootstrap';
    import { onDestroy, onMount } from 'svelte';

    let { data } = $props();

    let accountsTotal = $state(data.accountsTotal ?? 0);
    let accountsActive = $state(data.accountsActive ?? 0);
    let rolesTotal = $state(data.rolesTotal ?? 0);
    let rolesActive = $state(data.rolesActive ?? 0);
    let officesTotal = $state(data.officesTotal ?? 0);
    let officesActive = $state(data.officesActive ?? 0);
    let docTypesTotal = $state(data.docTypesTotal ?? 0);
    let docTypesActive = $state(data.docTypesActive ?? 0);
    let docTagsTotal = $state(data.docTagsTotal ?? 0);
    let docTagsActive = $state(data.docTagsActive ?? 0);
    let systemActivity = $state(data.systemActivity ?? []);
    let activeUsers = $state(data.activeUsers ?? []);

    let connected = $state(true);
    let lastHeartbeat = Date.now();

    // const source = new EventSource('http://localhost:8080/api/events');
    const source = new EventSource('http://localhost/api/events');

    onMount(() => {
        source.onmessage = (event) => {
            connected = true;
            lastHeartbeat = Date.now();

            try {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'accounts-count':
                        accountsTotal = data.message.total;
                        accountsActive = data.message.active;
                        break;
                    case 'roles-count':
                        rolesTotal = data.message.total;
                        rolesActive = data.message.active;
                        break;
                    case 'offices-count':
                        officesTotal = data.message.total;
                        officesActive = data.message.active;
                        break;
                    case 'doc-types-count':
                        docTypesTotal = data.message.total;
                        docTypesActive = data.message.active;
                        break;
                    case 'doc-tags-count':
                        docTagsTotal = data.message.total;
                        docTagsActive = data.message.active;
                        break;
                    case 'system-activity':
                        systemActivity = data.message.activities;
                        break;
                    case 'active-users':
                        activeUsers = data.message.account;
                        break;
                }
            } catch (err) {
                console.error('SSE parse error:', err);
            }
        };

        source.onopen = () => {
            connected = true;
            lastHeartbeat = Date.now();
        };

        source.onerror = () => {
            if (Date.now() - lastHeartbeat > 20000) {
                connected = false;
            }
        };
    });

    onDestroy(() => {
        if (source) source.close(); // close the SSE connection
    });
</script>

<div class="row">
    <div class="col">
        <div class="row mb-4">
            <div class="col">
                <div class="d-flex justify-content-between">
                    <h5>Admin Dashboard</h5>
                    <div>
                        <span class="small me-2">Live Updates: </span>
                        {#if connected}
                            <span class="small badge bg-success">Connected</span>
                        {:else}
                            <span class="small badge bg-danger">Reconnecting...</span>
                        {/if}
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <span class="small text-muted">Quick create:</span>
                    <a href="/admin/accounts/create" class="small">+ Account</a>
                    <a href="/admin/roles/add" class="small">+ Roles</a>
                    <a href="/admin/offices/add" class="small">+ Offices</a>
                    <a href="/admin/document-types/add" class="small">+ Document Types</a>
                    <a href="/admin/document-tags/add" class="small">+ Document Tags</a>
                </div>
            </div>
        </div>

        <hr />
        <div class="row mb-4">
            <div class="col">
                <div class="d-flex flex-column flex-sm-row flex-wrap gap-3">
                    <div class="stat-card bg-white shadow-sm p-3">
                        <span class="small text-muted"><i class="bi bi-people me-2"></i>Accounts</span>
                        <h3>{accountsTotal}</h3>
                        <div class="d-flex justify-content-between">
                            <span class="text-success small"><i class="bi bi-check2-circle me-2"></i>{accountsActive} Active</span>
                        </div>
                    </div>
                    <div class="stat-card bg-white shadow-sm p-3">
                        <span class="small text-muted"><i class="bi bi-shield-lock me-2"></i>Roles</span>
                        <h3>{rolesTotal}</h3>
                        <div class="d-flex justify-content-between">
                            <span class="text-success small"><i class="bi bi-check2-circle me-2"></i>{rolesActive} Active</span>
                        </div>
                    </div>
                    <div class="stat-card bg-white shadow-sm p-3">
                        <span class="small text-muted"><i class="bi bi-geo-alt me-2"></i>Offices</span>
                        <h3>{officesTotal}</h3>
                        <div class="d-flex justify-content-between">
                            <span class="text-success small"><i class="bi bi-check2-circle me-2"></i>{officesActive} Active</span>
                        </div>
                    </div>
                    <div class="stat-card bg-white shadow-sm p-3">
                        <span class="small text-muted"><i class="bi bi-file-earmark-code me-2"></i>Document Types</span>
                        <h3>{docTypesTotal}</h3>
                        <div class="d-flex justify-content-between">
                            <span class="text-success small"><i class="bi bi-check2-circle me-2"></i>{docTypesActive} Active</span>
                        </div>
                    </div>
                    <div class="stat-card bg-white shadow-sm p-3">
                        <span class="small text-muted"><i class="bi bi-tags me-2"></i>Document Tags</span>
                        <h3>{docTagsTotal}</h3>
                        <div class="d-flex justify-content-between">
                            <span class="text-success small"><i class="bi bi-check2-circle me-2"></i>{docTagsActive} Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-12 col-sm-8">
                <div class="bg-white p-3">
                    <div class="d-flex justify-content-between">
                        <h5>System Activity</h5>
                        <a href="/admin/audit-trail" class="small">View more</a>
                    </div>
                    <ul class="list-group list-group-flush small overflow-auto" style="max-height: 650px;">
                        <li class="list-group-item">
                            <div class="d-flex">
                                <span class="text-muted small me-auto">Timestamp</span>
                                <span class="text-muted small">Actor</span>
                            </div>
                        </li>
                        {#each systemActivity as activity}
                            <li class="list-group-item">
                                <div class="d-flex">
                                    <span class="text-danger me-auto">{App.Format.date(activity.created_at).toDatetime()}</span>
                                    <span class="me-2"
                                        >{(() => {
                                            const id = (activity.api_endpoint.match(/\/(\d+)$/) || [])[1];
                                            return activity.details + (id ? ': ' + id : '');
                                        })()}</span
                                    >
                                    <span class="mx-2 text-muted">/</span>
                                    <span>{activity.full_name_2}</span>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
            <div class="col-12 col-sm-4">
                <div class="bg-white p-3">
                    <div class="d-flex justify-content-between">
                        <h5>Active Users</h5>
                        <a href="/admin/audit-trail" class="small">View more</a>
                    </div>
                    <ul class="list-group list-group-flush small overflow-auto" style="max-height: 650px;">
                        <li class="list-group-item">
                            <div class="d-flex">
                                <span class="text-muted small me-auto">Last Seen</span>
                                <span class="text-muted small">User</span>
                            </div>
                        </li>
                        {#each activeUsers as user}
                            <li class="list-group-item">
                                <div class="d-flex">
                                    <span class="me-auto">{App.Format.date(user.last_seen).toDatetime()}</span>
                                    <span>{user.account.user.full_name_2}</span>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .stat-card {
        min-width: 250px;
    }
</style>
