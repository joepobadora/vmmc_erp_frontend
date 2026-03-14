<script>
    import { goto } from '$app/navigation';

    let { label = '', loadinglabel = '', icon = '', variant = 'primary', size = 'sm', loading = false, disabled = false, confirm = null, href = null, onClick = null } = $props();

    let internalLoading = $state(false);

    async function handleClick() {
        if (disabled || loading || internalLoading) return;

        if (confirm) {
            const ok = window.confirm(confirm);
            if (!ok) return;
        }

        if (onClick) {
            internalLoading = true;

            try {
                await onClick();
            } finally {
                internalLoading = false;
            }
        }

        if (href) {
            goto(href);
        }
    }
</script>

<button type="button" class="btn btn-{variant} {variant == 'light' ? 'border' : ''} btn-{size} px-3" onclick={handleClick} disabled={disabled || loading || internalLoading}>
    {#if loading || internalLoading}
        <span class="spinner-border spinner-border-sm me-2"></span>
        {loadinglabel}...
    {:else}
        {#if icon}
            <i class={`bi ${icon} me-2`}></i>
        {/if}

        {label}
    {/if}
</button>
