<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import Navbar from '$lib/components/Navbar.svelte';
    import { onMount } from 'svelte';
    import Sidebar from './components/Sidebar.svelte';
    import Footer from '../../lib/components/Footer.svelte';

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
    <title>VMMC ERP - DMS</title>
</svelte:head>

{#if auth}
    <!-- navbar -->
    <div class="row mb-5">
        <div class="col px-0">
            <Navbar title="VMMC ERP - DEx" titleRoute="/dex" showHome="true" />
        </div>
    </div>

    <!-- main -->
    <div class="container">
        <div class="row">
            <div class="col-sm-2"><Sidebar /></div>
            <div class="col-sm-10"><slot /></div>
        </div>
    </div>

    <!-- footer -->
    <Footer />
{/if}
