<script>
	import { onMount } from 'svelte';
	import Alerts from '$lib/components/Alerts.svelte';
</script>

<svelte:head>
	<link rel="icon" href="/vmmc_logo.png" />
	<link rel="stylesheet" href="/bootstrap.css" />
	<link rel="stylesheet" href="/bootstrap-icons/bootstrap-icons.css" />
	<title>VMMC ERP</title>
</svelte:head>

<Alerts />

<div class="d-flex flex-column min-vh-100 bg-light">
	<slot />
</div>
