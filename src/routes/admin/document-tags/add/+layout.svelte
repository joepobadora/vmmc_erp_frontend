<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { permissions } from '$lib/stores/access';

    onMount(async () => {
        if (!$permissions.includes('ADMIN.DOCTAGS_CREATE')) {
            goto('/403');
        }
    });
</script>

{#if $permissions.includes('ADMIN.DOCTAGS_CREATE')}
    <slot />
{/if}
