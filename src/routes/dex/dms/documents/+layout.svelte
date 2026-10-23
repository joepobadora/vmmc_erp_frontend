<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { modules } from '$lib/stores/access';

    onMount(async () => {
        // DMS Documents
        if (!$modules.includes('DEX1')) {
            goto('/403');
        }
    });
</script>

<!-- DMS Documents -->
{#if $modules.includes('DEX1')}
    <slot />
{/if}
