<script>
  import Navbar from "./components/Navbar.svelte";
</script>

<svelte:head>
  <title>VMMC ERP - Settings</title>
</svelte:head>

<div class="d-flex flex-column vh-100">
  <!-- navbar -->
  <Navbar />
  <!-- main -->
  <div class="flex-grow-1 bg-light">
    <slot />
  </div>
</div>
