<script>
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';

    // 1. Pass the lifecycles array directly as a prop
    let { lifecycles = [] } = $props();

    // In a history timeline, the top item (index 0) is usually the current state
    const currentIndex = 0;
</script>

<div class="timeline-container">
    <div class="vertical-track">
        <!-- The background line -->
        <div class="track-bg"></div>

        {#each lifecycles as item, i}
            <div class="timeline-item">
                <div class="marker-container">
                    <!-- Circle logic: active for the latest, done for historical -->
                    <div class="circle" class:active={i === currentIndex} class:done={i > currentIndex}>
                        {#if i > currentIndex}
                            ✓
                        {/if}
                    </div>
                </div>

                <div class="content small">
                    <div class="header-row mb-1">
                        <span class="title fw-semibold" class:active={i === currentIndex}>
                            {item.state.enumeration}
                        </span>
                        <span class="date text-danger ms-4">
                            {App.Format.date(item.created_at).toDatetime()}
                        </span>
                    </div>

                    <div class="details">
                        <div class="detail-row">
                            <span class="badge bg-{item.is_original == true ? 'primary' : 'secondary'}">{item.is_original == true ? 'Original' : 'Reference Copy'}</span>
                            <span class="version">Version: <b>{item.version.version_no}</b></span>
                        </div>
                        <div class="office-text text-muted">
                            Office: <span>{item.office.short_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .timeline-container {
        padding: 20px;
        /* max-width: 600px; */
        /* max-height: 750px; */
    }

    .vertical-track {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 15px; /* Spacing between history entries */
    }

    /* Background Line */
    .track-bg {
        position: absolute;
        top: 12px;
        bottom: 12px;
        left: 12px;
        width: 1px;
        background: #e5e7eb;
        z-index: 0;
    }

    .timeline-item {
        position: relative;
        display: flex;
        align-items: flex-start;
        z-index: 2;
    }

    .marker-container {
        flex-shrink: 0;
        width: 30px;
    }

    .circle {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #d1d5db;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.3s ease;
    }

    .circle.active {
        border-color: #008080;
        background: white;
        /* box-shadow: 0 0 0 4px rgba(0, 128, 128, 0.1); */
    }

    .circle.done {
        background: #f3f4f6;
        color: #9ca3af;
    }

    .content {
        margin-left: 15px;
        padding-top: 4px;
        flex-grow: 1;
    }

    /* .header-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 6px;
    } */

    /* .title {
        font-size: 15px;
        font-weight: 600;
        color: #374151;
    } */

    .title.active {
        color: #008080;
    }

    /* .date {
        font-size: 12px;
        color: #ef4444; 
    }

    .details {
        font-size: 13px;
        color: #6b7280;
    } */

    .detail-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 4px;
    }

    /* .office-text {
        font-size: 12px;
        color: #9ca3af;
    }

    .office-text span {
        color: #4b5563;
    } */

    /* .badge {
        font-size: 11px;
        padding: 1px 8px;
        border-radius: 4px;
        background: #f3f4f6;
        color: #6b7280;
        border: 1px solid #e5e7eb;
    } */

    /* .badge.original {
        background: #e6f2f2;
        color: #008080;
        border-color: #b3d9d9;
    } */

    /* .version b {
        color: #111827;
    } */
</style>
