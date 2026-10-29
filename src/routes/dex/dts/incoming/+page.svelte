<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto, pushState } from '$app/navigation';
    import j from '$lib/components/helper';
    import { permissions } from '$lib/stores/access';
    import { tranStatusMap } from '$lib/stores/statusMap';

    let { data } = $props();

    let officeList = $state(data.officeList ?? []);

    let loadingData = $state('false');
    let incoming = $state([]);

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
            const result = await App.API.post('/dex/dts/incoming', {
                filter: filter,
            });

            const data = result.data.data;

            if (result.data.success) {
                incoming = data;
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
</script>

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
                        <li class="breadcrumb-item small active">(Tracker) Incoming</li>
                    </ol>
                </nav>
            </div>
        </div>

        <div class="row mb-4">
            <!-- date from -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsFromDatePicker" class="small text-muted ms-1">Date from</label>
                <input bind:value={filter.start_date} type="date" class="form-control form-control-sm" id="docmngtMyDocumentsFromDatePicker" placeholder="YYYY-MM-DD" />
            </div>

            <!-- date to -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsToDatePicker" class="small text-muted ms-1">Date to</label>
                <input bind:value={filter.end_date} type="date" class="form-control form-control-sm" id="docmngtMyDocumentsToDatePicker" placeholder="YYYY-MM-DD" />
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
                            <i title="This will include document no and document name in your query." class="bi bi-question-circle-fill ms-1 text-primary"></i>
                        </div>
                    </div>
                </div>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Search by transaction no., tile, or description..."
                    id="docmngtMyDocumentsSearchInput"
                    bind:value={filter.search}
                />
            </div>

            <!-- office -->
            <div class="col-auto">
                <label for="docmngtMyDocumentsDocumentTypeSelect" class="small text-muted ms-1">Office</label>
                <input list="docmngtMyDocumentsDocumentTypeSelectList" class="form-control form-control-sm" placeholder="Type and choose..." id="docmngtMyDocumentsDocumentTypeSelect" />

                <!-- dynamic datalist of document type -->
                <datalist id="docmngtMyDocumentsDocumentTypeSelectList">
                    {#each officeList as office}
                        <option data-id={office.id} value={office.short_name}></option>
                    {/each}
                </datalist>
            </div>

            <!-- reset button -->
            <div class="col-auto d-flex align-items-end">
                <button onclick={resetFilter} type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
            </div>
        </div>

        <!-- table -->
        <div class="card border-0 shadow-sm px-3">
            <div class="card-body">
                {#if loadingData}
                    <div class="d-flex justify-content-center p-4">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>
                {:else}
                    <Table data={incoming} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
                        <div slot="row" let:item class="row border-bottom custom-row small" class:unread-row={!item.state?.is_read}>
                            <div class="col-auto pe-0 ps-3">
                                {#if !item.state?.is_read}
                                    <!-- solid red dot for Unread -->
                                    <span class="bi bi-envelope-fill text-danger" title="Unread"></span>
                                {:else}
                                    <!-- Subtle open envelope icon or blank spacer for Read -->
                                    <i class="bi bi-envelope-open text-muted opacity-50" title="Read"></i>
                                {/if}
                            </div>

                            <div class="col">
                                <div>
                                    <span class="text-muted me-2">Name:</span>
                                    {#if $permissions.includes('DTS.INCOMING_VIEW')}
                                        <strong
                                            class="custom-link"
                                            onclick={() => {
                                                goto(page.url.pathname + `/view/${item.id}${p.toString()}`);
                                            }}
                                        >
                                            {item.document?.latest_version?.name}
                                        </strong>
                                    {:else}
                                        <strong>
                                            {item.document?.latest_version?.name}
                                        </strong>
                                    {/if}
                                </div>
                                <div>
                                    <span class="text-muted me-2">Tran. No.:</span>
                                    <span>{item.transaction_no}</span>
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <span class="text-muted me-2">Status:</span>
                                </div>
                                <div class="d-flex flex-row flex-wrap gap-2">
                                    <j.Tag name={tranStatusMap[item.state.state_code].label} color={tranStatusMap[item.state.state_code].color} />
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
            </div>
        </div>
    </div>
</div>
