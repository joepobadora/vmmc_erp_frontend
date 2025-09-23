<script>
	import Navbar from './components/Navbar.svelte';
</script>

<svelte:head>
	<title>VMMC ERP - Home</title>
</svelte:head>

<div class="d-flex flex-column vh-100">
	<!-- navbar -->
	<div style:height="48px">
		<Navbar />
	</div>
	<!-- main -->
	<div class="flex-grow-1 bg-light">
		<slot />
	</div>
</div>
