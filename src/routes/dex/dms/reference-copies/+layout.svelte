<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { modules } from '$lib/stores/access';

    onMount(async () => {
        if (!$modules.includes('DEX2')) {
            goto('/403');
        }
    });
</script>

// DMS Reference Copies
{#if $modules.includes('DEX2')}
    <slot />
{/if}
