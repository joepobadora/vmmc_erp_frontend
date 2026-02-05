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
                        <li class="breadcrumb-item"><a href="/dex">DEx</a></li>
                        <li class="breadcrumb-item active">(Document Manager) Trash</li>
                    </ol>
                </nav>
            </div>
        </div>

        <div class="row mb-4">
            <!-- date from -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsFromDatePicker" class="small text-muted ms-1">Date from</label>
                <input type="date" class="form-control form-control-sm" id="docmngtMyDocumentsFromDatePicker" placeholder="YYYY-MM-DD" />
            </div>

            <!-- date to -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsToDatePicker" class="small text-muted ms-1">Date to</label>
                <input type="date" class="form-control form-control-sm" id="docmngtMyDocumentsToDatePicker" placeholder="YYYY-MM-DD" />
            </div>

            <!-- search -->
            <div class="col">
                <div class="row">
                    <div class="col">
                        <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                    </div>
                    <div class="col-auto">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                            <label class="form-check-label small text-muted" for="checkDefault">Advanced search</label>
                            <i title="This will include file content, file name, and record content in your query." class="bi bi-question-circle-fill ms-1 text-primary"></i>
                        </div>
                    </div>
                </div>
                <input type="text" class="form-control form-control-sm" placeholder="Search by document no., name, or details..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- tags -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsTagButton" class="small text-muted ms-1">Tags</label>
                <div>
                    <button type="button" class="btn btn-light border btn-sm px-3" id="docmngtMyDocumentsTagButton" data-bs-toggle="dropdown"><i class="bi bi-chevron-down small"></i></button>
                    <ul class="dropdown-menu dropdown-menu-end" id="docmngtMyDocumentsTagContainer"></ul>
                </div>
            </div>

            <!-- variatn -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Variant</label>
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
