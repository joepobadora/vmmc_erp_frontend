<script>
    import Navbar from './components/Navbar.svelte';
    import Sidebar from './components/Sidebar.svelte';
</script>

<svelte:head>
    <title>VMMC ERP - DMS</title>
</svelte:head>

<!-- navbar -->
<div class="row mb-5">
    <div class="col px-0">
        <Navbar />
    </div>
</div>

<!-- main -->
<div class="container">
    <div class="row">
        <div class="col-sm-2"><Sidebar /></div>
        <div class="col-sm-10"><slot /></div>
    </div>
</div>
