<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { modules } from '$lib/stores/access';

    onMount(async () => {
        if (!$modules.includes('DEX4')) {
            goto('/403');
        }
    });
</script>

<!-- DMS Archive -->
{#if $modules.includes('DEX4')}
    <slot />
{/if}
