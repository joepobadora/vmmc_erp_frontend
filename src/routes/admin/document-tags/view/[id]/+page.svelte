<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/state';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);

    let name = $state(data.documentTag.name ?? '');
    let office = $state(data.documentTag.office ?? '');
    let status = $state(data.documentTag.status ?? true);
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
                        <li class="breadcrumb-item small"><a href="/admin/document-tags?page={page.url.searchParams.get('page')}">Document Tags</a></li>
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
                            <h5>View document tag</h5>
                            <p class="small text-muted">
                                A user account grants an individual access to the ERP system, enabling them to perform authorized tasks and access modules based on their assigned role and permissions.
                            </p>
                        </div>
                        <hr class="text-muted" />
                        <h5>Document Tag</h5>
                        <div class="row mb-3">
                            <div class="col-12 col-md-6">
                                <label for="username" class="form-label small">Tag<span class="ms-1 text-danger">*</span></label>
                                <input bind:value={name} type="text" class="form-control form-control-sm" id="username" disabled />
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="office" class="form-label small">Office<span class="ms-1 text-danger">*</span></label>
                                <input bind:value={office} list="officeList" type="text" class="form-control form-control-sm" id="office" disabled />
                                <datalist id="officeList">
                                    {#each officeList as office}
                                        <option value={office.short_name}></option>
                                    {/each}
                                </datalist>
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
                                    goto(`/admin/document-tags?page=${page.url.searchParams.get('page')}`);
                                }}>Okay</button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
