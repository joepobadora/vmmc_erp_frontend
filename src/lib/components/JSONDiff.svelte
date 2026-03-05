<script>
    import * as jsondiffpatch from 'jsondiffpatch';
    import * as html from 'jsondiffpatch/formatters/html';
    import { onMount } from 'svelte';

    export let old_values = {};
    export let new_values = {};

    let container;

    function safeParse(value) {
        if (!value) return {};

        // If it's already an object, return it
        if (typeof value === 'object') return value;

        try {
            return JSON.parse(value);
        } catch (e) {
            return {};
        }
    }

    onMount(() => {
        const oldData = safeParse(old_values);
        const newData = safeParse(new_values);

        // Compute the delta
        const delta = jsondiffpatch.diff(oldData, newData);

        if (delta) {
            // Render pretty HTML diff
            container.innerHTML = html.format(delta, oldData);
        } else {
            container.innerHTML = '<p>No changes detected</p>';
        }
    });
</script>

<!-- Container for diff -->
<div bind:this={container}></div>
