<!-- TreeItem.svelte -->
<script>
    // Self-import allows recursion (this is a valid pattern)
    import TreeItem from './TreeItem.svelte';

    export let node;
    let expanded = false;
</script>

<li>
    <div class="cursor-pointer" on:click={() => (expanded = !expanded)}>
        {#if node.children}
            <span>{expanded ? '📂' : '📁'}</span>
        {:else}
            <span>📄</span>
        {/if}
        {node.name}
    </div>

    {#if node.children && expanded}
        <ul class="pl-4">
            {#each node.children as child}
                <TreeItem node={child} />
            {/each}
        </ul>
    {/if}
</li>
