<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import Navbar from '$lib/components/Navbar.svelte';
    import { onMount } from 'svelte';
    import Sidebar from './components/Sidebar.svelte';
    import Footer from './components/Footer.svelte';

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
    <title>VMMC ERP - Admin Console</title>
</svelte:head>

{#if auth}
    <!-- navbar -->
    <div class="row mb-5">
        <div class="col px-0">
            <Navbar title="VMMC ERP - Admin Console" titleRoute="/admin" />
        </div>
    </div>

    <!-- main -->
    <div class="container">
        <div class="row">
            <div class="col-md-2"><Sidebar /></div>
            <div class="col-md-10"><slot /></div>
        </div>
    </div>

    <!-- footer -->
    <Footer />
{/if}
