<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { onMount } from 'svelte';
    import z from 'zod';

    let { data } = $props();

    let division = $state(data.division ?? '');
    let abbreviation = $state(data.abbreviation ?? '');
    let department = $state(data.department ?? '');
    let office = $state(data.office ?? '');
    let status = $state(data.status ?? false);
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
                        <li class="breadcrumb-item small"><a href="/admin/offices?page={page.url.searchParams.get('page')}">Offices</a></li>
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
                            <h5>View office</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Office</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-sm-6">
                                <label for="password" class="form-label small">Division</label>
                                <input bind:value={division} type="text" class="form-control form-control-sm" id="password" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Department</label>
                                <input bind:value={department} type="text" class="form-control form-control-sm" id="username" disabled />
                            </div>
                            <div class="col-12 col-sm-3">
                                <label for="confirmPassword" class="form-label small">Dept. Abbreviation</label>
                                <input bind:value={abbreviation} type="text" class="form-control form-control-sm" id="confirmPassword" disabled />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office</label>
                                <input bind:value={office} type="text" class="form-control form-control-sm" id="office" disabled />
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
                                    goto(`/admin/offices?page=${page.url.searchParams.get('page')}`);
                                }}>Okay</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
