<script>
    import { page } from '$app/stores';
</script>

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/admin">Admin Console</a></li>
                        <li class="breadcrumb-item active">Roles</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><a class="btn btn-primary btn-sm px-3" href={$page.url.pathname + '/create'}><i class="bi bi-plus-lg me-2"></i>Add</a></div>
        </div>

        <div class="row mb-4">
            <!-- search -->
            <div class="col">
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                <input type="text" class="form-control form-control-sm" placeholder="Search by name..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- status -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Status</label>
                <select class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
                    <option value="All" selected>All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <!-- reset button -->
            <div class="col-auto d-flex align-items-end">
                <button type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
            </div>
        </div>

        <!-- table -->
        <div class="card border-0 shadow-sm px-3">
            <div class="card-body"></div>
        </div>
    </div>
</div>
