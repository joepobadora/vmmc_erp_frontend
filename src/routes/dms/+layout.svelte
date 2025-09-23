<script>
	import Navbar from './components/Navbar.svelte';
	import Sidebar from './components/Sidebar.svelte';
</script>

<svelte:head>
	<title>VMMC ERP - DMS</title>
</svelte:head>

<div class="d-flex flex-column vh-100">
	<!-- navbar -->
	<div style:height="48px">
		<Navbar />
	</div>
	<!-- main -->
	<div class="flex-grow-1">
		<div class="h-100 d-flex">
			<Sidebar />
			<slot />
		</div>
	</div>
</div>
