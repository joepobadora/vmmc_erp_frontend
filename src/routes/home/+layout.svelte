<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import { onMount } from 'svelte';

    // route guard
    let auth = null;

    onMount(async () => {
        auth = await App.Auth.loggedIn();

        if (!auth) {
            goto('/login');
        }
    });
</script>

<svelte:head>
    <title>VMMC ERP - Home</title>
</svelte:head>

{#if auth}
    <!-- navbar -->
    <div class="row mb-5">
        <div class="col px-0">
            <Navbar title="VMMC ERP" titleRoute="/home" />
        </div>
    </div>

    <!-- main -->
    <div class="container mb-auto">
        <div class="row">
            <div class="col-sm-12"><slot /></div>
        </div>
    </div>

    <!-- footer -->
    <Footer />
{/if}
