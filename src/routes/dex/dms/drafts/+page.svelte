<script>
    import { page } from '$app/stores';
    import j from '$lib/components/helper';
    import Row from '$lib/components/helper/Row.svelte';
</script>

<!-- controls -->
<j.Row>
    <j.Col>
        <nav style="--bs-breadcrumb-divider: '>';">
            <ol class="breadcrumb">
                <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
                <li class="breadcrumb-item small active">(Document Manager) Drafts</li>
            </ol>
        </nav>
    </j.Col>
    <j.Col auto>
        <div class="dropdown">
            <button class="btn btn-primary btn-sm px-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-plus-lg me-2"></i>Create</button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item small" href="/dex/dms/drafts/create/file-upload"><i class="bi bi-paperclip me-2"></i>Upload a file</a></li>
                <li><a class="dropdown-item small" href="/dex/dms/drafts/create/record"><i class="bi bi-database me-2"></i>Create a record</a></li>
            </ul>
        </div>
    </j.Col>
</j.Row>

<!-- filter  -->
<j.Row endy>
    <j.Col auto>
        <label for="from" class="small text-muted ms-1">Date from</label>
        <input type="date" class="form-control form-control-sm" id="from" placeholder="YYYY-MM-DD" />
    </j.Col>
    <j.Col auto>
        <label for="docmngtMyDocumentsToDatePicker" class="small text-muted ms-1">Date to</label>
        <input type="date" class="form-control form-control-sm" id="docmngtMyDocumentsToDatePicker" placeholder="YYYY-MM-DD" />
    </j.Col>
    <j.Col>
        <j.Row mb="0">
            <j.Col>
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
            </j.Col>
            <j.Col auto>
                <div class="form-check mb-0">
                    <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                    <label class="form-check-label small text-muted" for="checkDefault">Advanced search</label>
                    <i title="This will include file content, file name, and record content in your query." class="bi bi-question-circle-fill ms-1 text-primary"></i>
                </div>
            </j.Col>
        </j.Row>
        <j.RowCol mb="0">
            <input type="text" class="form-control form-control-sm" placeholder="Search by document no., name, or details..." id="docmngtMyDocumentsSearchInput" />
        </j.RowCol>
    </j.Col>
    <j.Col auto>
        <label for="docmngtMyDocumentsTagButton" class="small text-muted ms-1">Tags</label>
        <div>
            <button type="button" class="btn btn-light border btn-sm px-3" id="docmngtMyDocumentsTagButton" data-bs-toggle="dropdown"><i class="bi bi-chevron-down small"></i></button>
            <ul class="dropdown-menu dropdown-menu-end" id="docmngtMyDocumentsTagContainer"></ul>
        </div>
    </j.Col>
    <j.Col auto>
        <button type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
    </j.Col>
</j.Row>

<!-- table -->
<j.Card></j.Card>
