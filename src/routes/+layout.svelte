<script>
    import { onMount } from 'svelte';
    import Alerts from '$lib/components/Alerts.svelte';
    import '../styles/bootstrap.scss';
    import 'bootstrap-icons/font/bootstrap-icons.css';
    import '../app.css';
    import { BootstrapClient } from '$lib/stores/bootstrapClient';

    onMount(async () => {
        BootstrapClient.set(await import('bootstrap/dist/js/bootstrap.bundle.min.js'));
    });
</script>

<svelte:head>
    <link rel="icon" href="/vmmc_logo.png" />
    <title>VMMC ERP</title>
</svelte:head>

<Alerts />

<div class="container-fluid min-vh-100 bg-light">
    <slot />
</div>
