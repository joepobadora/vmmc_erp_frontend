<script>
    import Navbar from './components/Navbar.svelte';
    import Sidebar from './components/Sidebar.svelte';
</script>

<svelte:head>
    <title>VMMC ERP - DMS</title>
</svelte:head>

<!-- navbar -->
<Navbar />

<!-- main -->
<div class="container-fluid bg-success">
    <div class="row">
        <div class="col">
            <Sidebar />
        </div>
        <div class="col">
            <slot />
        </div>
    </div>
</div>
