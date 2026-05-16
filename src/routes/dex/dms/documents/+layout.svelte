<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { modules } from '$lib/stores/access';

    onMount(async () => {
        if (!$modules.includes('DEX1')) {
            goto('/403');
        }
    });
</script>

{#if $modules.includes('DEX1')}
    <slot />
{/if}
