<script>
    const { data = [], pageSize = 10, enablePagination = false, enableJumpToPage = false, enableTotalCount = false, maxPageButtons = 5 } = $props();

    let currentPage = $state(1);
    let jumpPage = $state(1);

    // derived
    let totalPages = $derived(Math.ceil(data.length / pageSize) || 1);
    let paginatedData = $derived(enablePagination ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : data);

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        jumpPage = page;
    }

    function renderPaginationButtons() {
        const buttons = [];
        const total = totalPages;
        if (total <= 1) return buttons;

        const half = Math.floor(maxPageButtons / 2);
        let start = currentPage - half;
        let end = currentPage + half;

        if (start < 2) {
            start = 2;
            end = Math.min(total - 1, start + maxPageButtons - 1);
        }
        if (end > total - 1) {
            end = total - 1;
            start = Math.max(2, end - maxPageButtons + 1);
        }

        buttons.push(1);
        if (start > 2) buttons.push('...');
        for (let i = start; i <= end; i++) buttons.push(i);
        if (end < total - 1) buttons.push('...');
        if (total > 1) buttons.push(total);
        return buttons;
    }
</script>

<!-- component -->
{#if data.length === 0}
    <!-- no data fallback -->
    <div class="row">
        <div class="col">
            <div class="fw-semibold small text-center text-muted">No data available.</div>
        </div>
    </div>
{:else}
    <!-- table -->
    <div class="row mb-3">
        <div class="col">
            <div>
                <!-- svelte-ignore slot_element_deprecated -->
                {#each paginatedData as item (item.id || item)}
                    <slot name="row" {item}>
                        <!-- fallback row -->
                        <div class="border-bottom py-1 px-2 small">
                            {#each Object.entries(item) as [key, value]}
                                <span class="me-3"><strong>{key}:</strong> {value}</span>
                            {/each}
                        </div>
                    </slot>
                {/each}
            </div>
        </div>
    </div>

    <!-- control group -->
    <div class="row">
        <!-- total count -->
        <div class="col-auto">
            {#if enableTotalCount}
                <div class="small text-muted text-center">Total Records: {data.length}</div>
            {/if}
        </div>

        <!-- pagination -->
        <div class="col-auto ms-auto">
            {#if enablePagination && totalPages > 1}
                <nav>
                    <ul class="pagination pagination-sm justify-content-center mt-2">
                        <li class="page-item {currentPage === 1 ? 'disabled' : ''}">
                            <button class="page-link" onclick={() => goToPage(currentPage - 1)} aria-label="go to page button">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>

                        {#each renderPaginationButtons() as num}
                            {#if num === '...'}
                                <li class="page-item disabled"><span class="page-link">…</span></li>
                            {:else}
                                <li class="page-item {num === currentPage ? 'active' : ''}">
                                    <button class="page-link" onclick={() => goToPage(num)}>{num}</button>
                                </li>
                            {/if}
                        {/each}

                        <li class="page-item {currentPage === totalPages ? 'disabled' : ''}">
                            <button class="page-link" onclick={() => goToPage(currentPage + 1)} aria-label="page link button">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            {/if}
        </div>

        <!-- jump to page -->
        <div class="col-auto">
            {#if enableJumpToPage}
                <div class="input-group input-group-sm mx-auto my-2" style="max-width: 200px;">
                    <span class="input-group-text">Jump to</span>
                    <input type="number" class="form-control" min="1" max={totalPages} bind:value={jumpPage} onkeydown={(e) => e.key === 'Enter' && goToPage(+jumpPage)} />
                    <button class="btn btn-outline-secondary" onclick={() => goToPage(+jumpPage)}>Go</button>
                </div>
            {/if}
        </div>
    </div>
{/if}
