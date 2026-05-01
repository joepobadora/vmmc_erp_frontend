<script>
    import App from '$lib/assets/js/bootstrap';

    let { icon = null, name, color = '#ffffff', onRemove = null, border = false } = $props();

    function handleRemove() {
        if (onRemove) {
            onRemove();
        }
    }
</script>

<span class="badge {border ? 'border border-1' : ''}" style="background-color: {color}; color: {App.Color.contrastThis(color)}">
    {#if icon}
        <i class={`bi ${icon} me-1`}></i>
    {/if}
    {name}
    {#if onRemove}
        <i onclick={handleRemove} class="bi bi-x-lg ms-2" style="cursor: pointer;"></i>
    {/if}
</span>
