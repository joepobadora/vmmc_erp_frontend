<!-- TreeView.svelte -->
<script>
    import { treeData } from './data.js';
    import TreeItem from './TreeItem.svelte';
</script>

<ul>
    {#each treeData as node}
        <TreeItem {node} />
    {/each}
</ul>
