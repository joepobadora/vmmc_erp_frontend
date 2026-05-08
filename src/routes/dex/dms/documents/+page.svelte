<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import j from '$lib/components/helper';

    const statusMap = {
        // Cluster 1: Drafting / Editing / Posting
        DOCSTATE1: { label: 'DRAFTED', color: '#E8EDF2' }, // blue
        DOCSTATE3: { label: 'UPDATED', color: '#E8EDF2' }, // blue
        DOCSTATE2: { label: 'POSTED', color: '#547A95' }, // blue

        // Cluster 2: Review / Decision
        DOCSTATE5: { label: 'REVIEWED', color: '#2C3947' }, // amber
        DOCSTATE6: { label: 'APPROVED', color: '#E8EDF2' }, // amber
        DOCSTATE7: { label: 'DECLINED', color: '#D96868' }, // amber

        // Cluster 3: Finalization / Routing
        DOCSTATE10: { label: 'SIGNED', color: '#547A95' }, // green
        DOCSTATE11: { label: 'ROUTED', color: '#547A95' }, // green

        // Cluster 4: Closure / End States
        DOCSTATE8: { label: 'DOWNLOADED', color: '#547A95' }, // gray
        DOCSTATE9: { label: 'ARCHIVED', color: '#547A95' }, // gray
        DOCSTATE4: { label: 'DELETED', color: '#D96868' }, // gray
    };

    let { data } = $props();

    let tagList = $state(data.tagList ?? []);

    let loadingData = $state('false');
    let drafts = $state([]);
    let tag = $state(null);

    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const p = new App.ParamBuilder(page.url.searchParams);
    window.history.replaceState({}, document.title, window.location.pathname); // ensure no lingering outdated params

    let tablePage = $state(p.get('page') || 1);

    let filter = $state({
        start_date: p.get('start_date') || App.Format.date(firstDayOfMonth).toISODate(),
        end_date: p.get('end_date') || App.Format.date(today).toISODate(),
        search: p.get('search') || null,
        adv_search: p.get('adv_search') === 'true' || false,
        status: p.get('status') || null,
        tags: hydrateTags(p.get('tags'), tagList),
    });

    function hydrateTags(idsString, tagList) {
        if (!idsString) return [];
        const ids = idsString.split(',').map(Number);
        return tagList.filter((tag) => ids.includes(tag.id));
    }

    // react to changes and update params
    $effect(() => {
        p.set('page', tablePage)
            .set('start_date', filter.start_date)
            .set('end_date', filter.end_date)
            .set('search', filter.search)
            .set('adv_search', filter.adv_search)
            .set('status', filter.status)
            .set('tags', filter.tags.map((tag) => tag.id).join(','));
    });

    // debounce and react to filter
    $effect(() => {
        filter.start_date;
        filter.end_date;
        filter.search;
        filter.adv_search;
        filter.status;
        filter.tags;

        const timer = setTimeout(() => {
            refreshTable();
        }, 300);

        return () => clearTimeout(timer);
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.post('/dex/dms/documents', {
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
            adv_search: false,
            status: null,
            tags: [],
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
                <li class="breadcrumb-item small active">(Document Manager) Documents</li>
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
        <input bind:value={filter.start_date} type="date" class="form-control form-control-sm" id="from" placeholder="YYYY-MM-DD" />
    </j.Col>
    <j.Col auto>
        <label for="to" class="small text-muted ms-1">Date to</label>
        <input bind:value={filter.end_date} type="date" class="form-control form-control-sm" id="to" placeholder="YYYY-MM-DD" />
    </j.Col>
    <j.Col>
        <j.Row mb="0">
            <j.Col>
                <label for="docmngtMyDocumentsSearchInput" class="small text-muted ms-1">Search</label>
            </j.Col>
            <j.Col auto>
                <div class="form-check mb-0">
                    <input bind:checked={filter.adv_search} class="form-check-input" type="checkbox" id="checkDefault" />
                    <label class="form-check-label small text-muted" for="checkDefault">Advanced search</label>
                    <i title="Activates smart and full text search, also includes file contents." class="bi bi-question-circle-fill ms-1 text-primary"></i>
                </div>
            </j.Col>
        </j.Row>
        <j.RowCol mb="0">
            <input bind:value={filter.search} type="text" class="form-control form-control-sm" placeholder="Search by document no., name, or details..." id="docmngtMyDocumentsSearchInput" />
        </j.RowCol>
    </j.Col>
    <j.Col auto>
        <label for="docmngtMyDocumentsStatusDropdown" class="small text-muted ms-1">Status</label>
        <select bind:value={filter.status} class="form-select form-select-sm" id="docmngtMyDocumentsStatusDropdown">
            <option value={null} selected>All</option>
            <option value="DOCSTATE6">Approved</option>
            <option value="DOCSTATE10">Signed</option>
            <option value="DOCSTATE11">Routed</option>
        </select>
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
        <button onclick={resetFilter} type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
    </j.Col>
</j.Row>

<div class="d-flex flex-row flex-wrap gap-2 my-3 small">
    {#each filter.tags as tag}
        <j.Tag name={tag.name} color={tag.color} onRemove={() => handleTagRemove(tag)} />
    {/each}
</div>

<!-- table -->
<j.Card>
    {#if loadingData}
        <div class="d-flex justify-content-center p-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    {:else}
        <Table data={drafts} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
            <div slot="row" let:item class="row border-bottom custom-row small">
                <div class="col">
                    <div>
                        <span class="text-muted me-2">Name:</span>
                        <strong
                            class="custom-link"
                            onclick={() => {
                                goto(page.url.pathname + `/view/${item.id}${p.toString()}`);
                            }}
                        >
                            {item.latest_version?.name}
                        </strong>
                    </div>
                    <div>
                        <span class="text-muted me-2">Type:</span>
                        <span>{item.latest_version?.document_type?.name}</span>
                    </div>
                    <div>
                        <!-- allows edit for approved, downloaded, and signed -->
                        {#if item.state.state_code == 'DOCSTATE6' || item.state.state_code == 'DOCSTATE8' || item.state.state_code == 'DOCSTATE10'}
                            <span
                                class="text-info custom-link"
                                onclick={() => {
                                    goto(page.url.pathname + `/edit/${item.id}${p.toString()}`);
                                }}>Edit</span
                            >
                        {/if}
                    </div>
                </div>
                <div class="col">
                    <div>
                        <span class="text-muted me-2">Status:</span>
                    </div>
                    <div class="d-flex flex-row flex-wrap gap-2">
                        <j.Tag name={statusMap[item.state.state_code].label} color={statusMap[item.state.state_code].color} />
                    </div>
                </div>
                <div class="col">
                    <div>
                        <span class="text-muted me-2">Tags:</span>
                    </div>
                    <div class="d-flex flex-row flex-wrap gap-2">
                        {#each item.tags as tag}
                            <j.Tag name={tag.name} color={tag.color} />
                        {/each}
                    </div>
                </div>
                <div class="col-auto ms-auto">
                    <div>
                        <span class="text-muted me-2">Date created:</span>
                        <span>{App.Format.date(item.created_at).toFullMonthDate()}</span>
                    </div>
                    <div>
                        <span class="text-muted me-2">By:</span>
                        <span>{item.creator.user.full_name_2}</span>
                    </div>
                </div>
            </div>
        </Table>
    {/if}
</j.Card>
