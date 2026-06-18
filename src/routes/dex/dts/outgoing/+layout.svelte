<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { modules } from '$lib/stores/access';

    onMount(async () => {
        if (!$modules.includes('DEX8')) {
            goto('/403');
        }
    });
</script>

{#if $modules.includes('DEX8')}
    <slot />
{/if}
