<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';

    const { data } = $props();

    let name = $state(data.name ?? '');
    let status = $state(data.status ?? true);
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
                        <li class="breadcrumb-item small"><a href="/admin/document-types?page={page.url.searchParams.get('page')}">Document Types</a></li>
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
                            <h5>View document type</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Document Type</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="password" class="form-label small">Type</label>
                                <input bind:value={name} type="text" class="form-control form-control-sm" id="password" disabled />
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
                            <button
                                type="button"
                                class="btn btn-primary btn-sm px-3"
                                onclick={() => {
                                    goto(`/admin/document-types?page=${page.url.searchParams.get('page')}`);
                                }}>Okay</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
