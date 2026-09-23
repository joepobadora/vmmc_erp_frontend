<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto, pushState } from '$app/navigation';
    import j from '$lib/components/helper';
    import { permissions } from '$lib/stores/access';

    const statusMap = {
        // Cluster 1: Drafting / Editing / Posting
        ACTION1: { label: 'DRAFTED', color: '#E8EDF2' }, // blue
        ACTION2: { label: 'POSTED', color: '#E8EDF2' }, // blue
        ACTION3: { label: 'BROADCASTED', color: '#547A95' }, // blue

        // Cluster 2: Review / Decision
        ACTION4: { label: 'RELEASED', color: '#2C3947' }, // amber
        ACTION5: { label: 'FORWARDED', color: '#E8EDF2' }, // amber
        ACTION6: { label: 'RECEIVED', color: '#D96868' }, // amber

        // Cluster 3: Finalization / Routing
        ACTION7: { label: 'ACKNOWLEDGED', color: '#547A95' }, // green
        ACTION8: { label: 'TERMINATED', color: '#547A95' }, // green
        ACTION9: { label: 'RETRIEVED', color: '#547A95' }, // green

        // Cluster 4: Closure / End States
        ACTION10: { label: 'ARCHIVED', color: '#547A95' }, // gray
        ACTION11: { label: 'DELETED', color: '#547A95' }, // gray
        ACTION12: { label: 'RECALLED', color: '#D96868' }, // gray
    };

    let { data } = $props();

    let loadingData = $state('false');
    let outgoing = $state([]);

    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const p = new App.ParamBuilder(page.url.searchParams);
    pushState(window.location.pathname); // ensure no lingering outdated params

    let tablePage = $state(p.get('page') || 1);

    let filter = $state({
        start_date: p.get('start_date') || App.Format.date(firstDayOfMonth).toISODate(),
        end_date: p.get('end_date') || App.Format.date(today).toISODate(),
        search: p.get('search') || null,
        adv_search: p.get('adv_search') === 'true' || false,
        status: p.get('status') || null,
    });

    // react to changes and update params
    $effect(() => {
        p.set('page', tablePage).set('start_date', filter.start_date).set('end_date', filter.end_date).set('search', filter.search).set('adv_search', filter.adv_search).set('status', filter.status);
    });

    // debounce and react to filter
    $effect(() => {
        filter.start_date;
        filter.end_date;
        filter.search;
        filter.adv_search;
        filter.status;

        const timer = setTimeout(() => {
            refreshTable();
        }, 300);

        return () => clearTimeout(timer);
    });

    async function refreshTable() {
        loadingData = true;

        try {
            const result = await App.API.post('/dex/dts/outgoing', {
                filter: filter,
            });

            const data = result.data.data;

            if (result.data.success) {
                outgoing = data;
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
        };
    }
</script>

<!-- controls -->
<j.Row>
    <j.Col>
        <nav style="--bs-breadcrumb-divider: '>';">
            <ol class="breadcrumb">
                <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
                <li class="breadcrumb-item small active">(Tracker) Outgoing</li>
            </ol>
        </nav>
    </j.Col>
    <j.Col auto>
        {#if $permissions.includes('DTS.DRAFTS_CREATE')}
            <a class="btn btn-primary btn-sm px-3" href={page.url.pathname + `/create${p.toString()}`}><i class="bi bi-plus-lg me-2"></i>Create</a>
        {/if}
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
            <input bind:value={filter.search} type="text" class="form-control form-control-sm" placeholder="Search by transaction no., name, or details..." id="docmngtMyDocumentsSearchInput" />
        </j.RowCol>
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
        <Table data={outgoing} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
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
                            {item.document?.latest_version?.name}
                        </strong>
                    </div>
                    <div>
                        <span class="text-muted me-2">Doc. No.:</span>
                        <span>{item.transaction_no}</span>
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
