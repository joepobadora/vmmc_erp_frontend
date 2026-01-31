<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import Navbar from '$lib/components/Navbar.svelte';
    import { onMount } from 'svelte';

    let auth = null;

    onMount(async () => {
        // auth = await App.Auth.loggedIn();
        auth = true;

        if (!auth) {
            goto('/login');
        }
    });
</script>

<svelte:head>
    <title>VMMC ERP - Settings</title>
</svelte:head>

{#if auth}
    <!-- navbar -->
    <div class="row mb-5">
        <div class="col px-0">
            <Navbar title="VMMC ERP - Settings" titleRoute="/settings" showHome hideSettings />
        </div>
    </div>

    <!-- main -->
    <div class="container">
        <div class="row">
            <div class="col-sm-12"><slot /></div>
        </div>
    </div>
{/if}
