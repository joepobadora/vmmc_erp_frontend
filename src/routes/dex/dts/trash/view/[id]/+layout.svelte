<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { permissions } from '$lib/stores/access';

    onMount(async () => {
        if (!$permissions.includes('DTS.TRASH_VIEW')) {
            goto('/403');
        }
    });
</script>

{#if $permissions.includes('DTS.TRASH_VIEW')}
    <slot />
{/if}
