<script>
    import Auth from '../../lib/components/Auth.svelte';

    let showAuth = $state(false);

    function launchAuth() {
        showAuth = true;
    }
    function handleClose() {
        showAuth = false; // parent updates its state
    }
</script>

<div class="container">
    <button onclick={launchAuth}>launch</button>
</div>

<Auth show={showAuth} close={handleClose} />
