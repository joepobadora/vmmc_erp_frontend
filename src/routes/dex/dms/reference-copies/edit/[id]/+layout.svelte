<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { permissions } from '$lib/stores/access';

    onMount(async () => {
        if (!$permissions.includes('DMS.DOCS_EDIT')) {
            goto('/403');
        }
    });
</script>

{#if $permissions.includes('DMS.DOCS_EDIT')}
    <slot />
{/if}
