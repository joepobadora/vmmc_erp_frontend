<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { BootstrapClient } from '$lib/stores/bootstrapClient';
	import { get } from 'svelte/store';

	let { id } = $props();
	let el;
	let bootstrapModal;

	$effect(() => {
		if ($BootstrapClient) {
			bootstrapModal = $BootstrapClient.Modal.getOrCreateInstance(el);
		}
	});

	function Logout() {
		bootstrapModal.hide();
		goto('/login');
	}
</script>

<div bind:this={el} class="modal fade" {id} data-bs-backdrop="static">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5>Logout</h5>
				<button
					type="button"
					class="btn-close btn-sm"
					data-bs-dismiss="modal"
					aria-label="close logout modal"
				></button>
			</div>
			<div class="modal-body">
				<p>Are you sure you want to logout?</p>
			</div>
			<div class="modal-footer border-top-0">
				<button type="button" class="btn btn-light border btn-sm px-3" data-bs-dismiss="modal"
					>Cancel</button
				>
				<button type="button" class="btn btn-danger btn-sm px-3" onclick={Logout}
					><i class="bi bi-box-arrow-left me-2"></i>Logout</button
				>
			</div>
		</div>
	</div>
</div>
