<script>
	import LogoutModal from '$lib/components/LogoutModal.svelte';

	const modalId = Date.now().toString();
</script>

<!-- html -->
<div class="h-100 bg-primary shadow-sm border-bottom d-flex p-2">
	<div class="ms-auto">
		<button
			class="btn btn-sm btn-light rounded-circle"
			data-bs-toggle="dropdown"
			aria-label="menu button"
		>
			<i class="bi bi-three-dots-vertical"></i></button
		>
		<ul class="dropdown-menu shadow-sm">
			<li>
				<a class="dropdown-item small" href=""><i class="bi bi-gear-fill me-2"></i>Settings</a>
			</li>
			<li><hr class="dropdown-divider" href="" /></li>
			<li>
				<a class="dropdown-item small" href="" data-bs-toggle="modal" data-bs-target="#{modalId}"
					><i class="bi bi-box-arrow-left me-2"></i>Logout</a
				>
			</li>
		</ul>

		<!-- Modal -->
		<LogoutModal id={modalId} />
	</div>
</div>
