<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/admin">Document Management System</a></li>
                        <li class="breadcrumb-item active">Internal Documents</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto"><button class="btn btn-primary btn-sm px-3"><i class="bi bi-plus-lg me-2"></i>Add new</button></div>
        </div>
        <div class="row">
            <!-- search -->
            <div class="col">
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
                <input type="text" class="form-control form-control-sm" placeholder="Search by document no, title, or description..." id="docmngtMyDocumentsSearchInput" />
            </div>

            <!-- document type -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsDocumentTypeSelect" class="small text-muted ms-1">Document Type</label>
                <input list="adminUsersDepartmentSelectList" class="form-control form-control-sm" placeholder="Type and choose..." id="docmngtMyDocumentsDocumentTypeSelect" />

                <!-- dynamic datalist of document type -->
                <datalist id="docmngtMyDocumentsDocumentTypeSelectList"></datalist>
            </div>

            <!-- tags -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsTagButton" class="small text-muted ms-1">Tags</label>
                <div>
                    <button type="button" class="btn btn-light border btn-sm px-3" id="docmngtMyDocumentsTagButton" data-bs-toggle="dropdown"><i class="bi bi-chevron-down small"></i></button>
                    <ul class="dropdown-menu dropdown-menu-end" id="docmngtMyDocumentsTagContainer"></ul>
                </div>
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

            <!-- reset button -->
            <div class="col-auto d-flex align-items-end">
                <button type="button" class="btn btn-light border btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
            </div>
        </div>
    </div>
</div>
