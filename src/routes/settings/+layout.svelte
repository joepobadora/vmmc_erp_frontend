<script>
    import Navbar from './components/Navbar.svelte';
</script>

<svelte:head>
    <title>VMMC ERP - Settings</title>
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
        <div class="col-sm-12"><slot /></div>
    </div>
</div>
