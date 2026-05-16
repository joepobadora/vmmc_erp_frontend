<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import Navbar from '$lib/components/Navbar.svelte';
    import { onMount } from 'svelte';
    import Footer from '../../lib/components/Footer.svelte';

    let auth = null;

    onMount(async () => {
        auth = await App.Auth.loggedIn();

        if (!auth) {
            goto('/login');
        }
    });
</script>

<svelte:head>
    <title>VMMC ERP - TEMPLATES</title>
</svelte:head>

{#if auth == true}
    <!-- navbar -->
    <div class="row mb-5">
        <div class="col px-0">
            <Navbar title="VMMC ERP - TEMPLATES" titleRoute="" showHome="true" />
        </div>
    </div>

    <!-- main -->
    <div class="container mb-auto">
        <slot />
    </div>

    <!-- footer -->
    <div class="row">
        <div class="col px-0">
            <Footer />
        </div>
    </div>
{/if}
