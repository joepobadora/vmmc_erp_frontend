<script>
    import Auth from '../../lib/components/Auth.svelte';

    let showAuth = $state(false);

    function handleResult(result) {
        showAuth = false;
    }

    function handleClose() {
        showAuth = false;
    }
</script>

<div class="container">
    <button
        onclick={() => {
            showAuth = true;
        }}>launch</button
    >
</div>

{#if showAuth}
    <Auth authResult={handleResult} close={handleClose} />
{/if}
