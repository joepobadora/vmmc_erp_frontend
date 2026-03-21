<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

    let { data } = $props();

    let tagList = $state(data.tagList ?? []);

    let loadingData = $state('false');
    let drafts = $state([]);
    let tag = $state(null);

    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const p = new App.ParamBuilder(page.url.searchParams);

    let tablePage = $state(p.get('page') || 1);

    let filter = $state({
        start_date: p.get('start_date') || App.Format.date(firstDayOfMonth).toISODate(),
        end_date: p.get('end_date') || App.Format.date(today).toISODate(),
        search: p.get('search') || null,
        tags: p.get('tags') || [],
    });

    // react to changes and update params
    $effect(() => {
        p.set('page', tablePage).set('start_date', filter.start_date).set('end_date', filter.end_date).set('search', filter.search);
    });

    // debounce and react to filter
    $effect(() => {
        filter.start_date;
        filter.end_date;
        filter.search;

        const timer = setTimeout(() => {
            refreshTable();
        }, 300);

        return () => clearTimeout(timer);
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.post('/dex/dms/drafts', {
                filter: filter,
            });

            const data = result.data.data;

            if (result.data.success) {
                drafts = data;
            } else {
                Alert.show('error', 'Request failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            loadingData = false;
        }
    }

    function resetFilter() {
        filter = {
            start_date: App.Format.date(firstDayOfMonth).toISODate(),
            end_date: App.Format.date(today).toISODate(),
            search: null,
        };
    }

    function handleTagSelect() {
        if (!filter.tags.includes(tag)) {
            filter.tags = [...filter.tags, tag];
        }
        tag = null;
    }
    function handleTagRemove(tag) {
        filter.tags = filter.tags.filter((t) => t !== tag);
    }
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
        <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Tag</label>
        <select onchange={handleTagSelect} bind:value={tag} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
            <option value={null}>All</option>
            {#each tagList as tag}
                <option value={tag}>{tag.name}</option>
            {/each}
        </select>
    </j.Col>
    <j.Col auto>
        <button type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
    </j.Col>
</j.Row>

<div class="d-flex flex-row flex-wrap gap-2 my-3">
    {#each filter.tags as tag}
        <j.Tag name={tag.name} color={tag.color} onRemove={() => handleTagRemove(tag)} />
    {/each}
</div>

<!-- table -->
<j.Card></j.Card>
