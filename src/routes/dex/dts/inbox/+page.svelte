<script>
    import { page } from '$app/state';
    import Table from '$lib/components/Table.svelte';
    import App from '$lib/assets/js/bootstrap';
    import { Alert } from '$lib/stores/alert';
    import { goto, pushState } from '$app/navigation';
    import j from '$lib/components/helper';
    import { permissions } from '$lib/stores/access';
    import ReceivingPrompt from '../../components/ReceivingPrompt.svelte';

    const statusMap = {
        // Cluster 1: Drafting / Editing / Posting (Neutral / Light Blues & Grays)
        ACTION1: { label: 'DRAFTED', color: '#E2E8F0' }, // Slate Gray
        ACTION2: { label: 'POSTED', color: '#E0F2FE' }, // Light Sky Blue
        ACTION3: { label: 'BROADCASTED', color: '#BAE6FD' }, // Sky Blue

        // Cluster 2: Review / Decision (Ambers & Soft Indigos)
        ACTION4: { label: 'RELEASED', color: '#FEF3C7' }, // Soft Amber
        ACTION5: { label: 'FORWARDED', color: '#E0E7FF' }, // Soft Indigo
        ACTION6: { label: 'RECEIVED', color: '#D1FAE5' }, // Soft Green (Incoming arrival)

        // Cluster 3: Finalization / Routing (Success & Completion Greens/Purples)
        ACTION7: { label: 'ACKNOWLEDGED', color: '#A7F3D0' }, // Vibrant Soft Green
        ACTION8: { label: 'TERMINATED', color: '#FEE2E2' }, // Soft Red (Halted/Stopped)
        ACTION9: { label: 'RETRIEVED', color: '#DDD6FE' }, // Soft Purple

        // Cluster 4: Closure / End States (Neutrals, Oranges & Danger Reds)
        ACTION10: { label: 'ARCHIVED', color: '#F3F4F6' }, // Neutral Gray
        ACTION11: { label: 'DELETED', color: '#FCA5A5' }, // Danger Red
        ACTION12: { label: 'RECALLED', color: '#FED7AA' }, // Soft Orange
        ACTION13: { label: 'REJECTED', color: '#F87171' }, // Strong Red
    };

    let { data } = $props();

    let receivePrompt = $state(null);

    let tranNo = $state('');

    let officeList = $state(data.officeList ?? []);

    let loadingData = $state('false');
    let inbox = $state([]);

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
            const result = await App.API.post('/dex/dts/inbox', {
                filter: filter,
            });

            const data = result.data.data;

            if (result.data.success) {
                inbox = data;
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

    async function receive() {
        try {
            const result = await App.API.post('/dex/dts/inbox/preview', {
                transaction_no: tranNo,
            });

            const data = result.data.data;

            if (result.data.success) {
                if (data == null) {
                    Alert.show('warning', 'Transaction retrieval failed.', 'The transaction is invalid.');
                    return;
                }

                const eligibleTransactions = [
                    'ACTION4', // Released
                ];

                if (eligibleTransactions.filter((x) => x == data.state.state_code).length == 0) {
                    Alert.show('warning', 'Transaction retrieval failed.', 'The transaction not available for receiving');
                    return;
                }

                if (await receivePrompt.confirm()) refreshTable();
            } else {
                Alert.show('error', 'Request failed.', result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        } finally {
            loadingData = false;
        }
    }
</script>

<ReceivingPrompt bind:me={receivePrompt} {tranNo} />

<div class="row">
    <div class="col">
        <!-- controls -->
        <div class="row mb-4">
            <!-- breadcrumbs -->
            <div class="col">
                <nav style="--bs-breadcrumb-divider: '>';">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item small"><a href="/dex">DEx</a></li>
                        <li class="breadcrumb-item small active">(Tracker) Inbox</li>
                    </ol>
                </nav>
            </div>
            <div class="col-auto col-md-6">
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" placeholder="Enter transaction no." bind:value={tranNo} />
                    <button class="btn btn-primary px-3" onclick={receive}><i class="bi bi-arrow-down me-2"></i>Receive</button>
                </div>
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
                            <i title="This will include document no, document name, and document details in your query." class="bi bi-question-circle-fill ms-1 text-primary"></i>
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
                <button type="button" class="btn btn-outline-primary btn-sm px-3" id="docmngtMyDocumentsResetButton">Reset</button>
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
                    <Table data={inbox} enableTotalCount enablePagination pageSize="10" bind:currentPage={tablePage}>
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
            </div>
        </div>
    </div>
</div>
