<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import JSONDiff from '$lib/components/JSONDiff.svelte';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    const { data } = $props();
</script>

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item small"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item small"><a href="/admin/audit-trail?page={page.url.searchParams.get('page')}">Audit Trail</a></li>
                        <li class="breadcrumb-item small active">View</li>
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
                            <h5>View log</h5>
                            <p class="small text-muted">
                                The audit trail allows administrators to track user activity within the ERP system. It records actions performed by users, including the module accessed, operations
                                executed, and timestamps, providing a transparent history for security, compliance, and accountability purposes.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Metadata</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-auto">
                                <span class="small">Timestamp: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{App.Format.date(data.created_at).toMilliseconds()}</span>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Actor</h5>
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <span class="small">Name: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.full_name_2}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <span class="small">IP Address: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.ip_address}</span>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-auto">
                                <span class="small">User Agent: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.user_agent}</span>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Entity</h5>
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <span class="small">Client Route: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.client_route}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <span class="small">Entity: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.entity}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-auto">
                                <span class="small">Method: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.action_taken_snapshot}</span>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-auto">
                                <span class="small">Action Taken: </span>
                            </div>
                            <div class="col-12 col-sm-auto">
                                <span class="small">{data.details}</span>
                            </div>
                        </div>
                        <hr class="text-muted" />
                        <h5>Data Changes</h5>
                        <div class="row mb-4">
                            <div class="col">
                                <div class="bg-light overflow-auto border mt-3 p-3" style="max-height: 600px;">
                                    <JSONDiff old_values={data.old_values} new_values={data.new_values} />
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column flex-sm-row justify-content-sm-end">
                            <button
                                type="button"
                                class="btn btn-primary btn-sm px-3"
                                onclick={() => {
                                    goto(`/admin/audit-trail?page=${page.url.searchParams.get('page')}`);
                                }}>Okay</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
