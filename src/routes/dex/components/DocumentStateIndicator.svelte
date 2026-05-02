<script>
    // 1. Use the $props rune for component inputs
    let { currentState = 'DOCSTATE1' } = $props();

    const steps = [
        {
            // drafted, updated, declined
            key: ['DOCSTATE1', 'DOCSTATE3', 'DOCSTATE7'],
            title: 'Drafted',
            desc: 'Initial document creation and internal drafting.',
        },
        {
            key: 'DOCSTATE2',
            title: 'Posted',
            desc: 'Document has been officially posted for initial feedback.',
        },
        {
            key: 'DOCSTATE5',
            title: 'Reviewed',
            desc: 'Technical and compliance review is currently in progress.',
        },
        {
            key: 'DOCSTATE6',
            title: 'Approved',
            desc: 'Final approval granted. Document is ready for use.',
        },
    ];

    // 2. Use the $derived rune instead of $:
    let currentIndex = $derived(steps.findIndex((s) => s.key.includes(currentState)));
    let progressWidth = $derived(currentIndex === -1 ? 0 : (currentIndex / (steps.length - 1)) * 100);
</script>

<div class="container">
    <div class="track">
        <!-- progress line -->
        <div class="progress" style="width: {progressWidth}%"></div>

        {#each steps as step, i}
            <div class="step">
                <div class="circle" class:done={i < currentIndex} class:active={i === currentIndex}>
                    {#if i < currentIndex}
                        ✓
                    {:else}
                        {i + 1}
                    {/if}
                </div>

                <div class="title fw-semibold small my-2" class:active={i === currentIndex}>
                    {step.title}
                </div>

                <div class="desc small text-muted px-4 my-1">
                    {step.desc}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    /* Styles remain largely the same, optimized for the component */
    .container {
        width: 100%;
        padding: 20px 10px;
    }

    .track {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start; /* Better alignment for varying desc lengths */
    }

    .track::before {
        content: '';
        position: absolute;
        top: 12px;
        left: 0;
        right: 0;
        height: 2px;
        background: #e5e7eb;
        z-index: 0;
    }

    .progress {
        position: absolute;
        top: 12px;
        left: 0;
        height: 1px;
        background: #008080;
        z-index: 1;
        transition: width 0.3s ease;
    }

    .step {
        position: relative;
        z-index: 2;
        text-align: center;
        width: 25%;
    }

    .circle {
        width: 24px;
        height: 24px;
        margin: 0 auto;
        border-radius: 50%;
        border: 2px solid #d1d5db;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .circle.done {
        background: #008080;
        border-color: #008080;
        color: white;
    }

    .circle.active {
        border-color: #008080;
        color: #008080;
        font-weight: bold;
    }

    /* .title {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
    } */

    .title.active {
        color: #008080;
    }

    /* .desc {
        margin-top: 6px;
        font-size: 12px;
        color: #6b7280;
        max-width: 160px;
        margin-left: auto;
        margin-right: auto;
    } */
</style>
