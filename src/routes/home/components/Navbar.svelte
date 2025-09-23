<script>
	import LogoutModal from '$lib/components/LogoutModal.svelte';

	let modalId = 'logoutModal';
	let collapseID = 'navbarCollapse';
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm border-bottom py-1 px-2">
	<div class="container-fluid">
		<a class="navbar-brand" href="/home">VMMC - ERP</a>

		<div class="dropdown text-light">
			<a
				class="nav-link dropdown-toggle"
				href="/"
				data-bs-toggle="dropdown"
				aria-label="menu button"
			>
				<i class="bi bi-three-dots-vertical"></i>
			</a>
			<ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-label="menu dropdown">
				<li>
					<a class="dropdown-item small" href="/settings">
						<i class="bi bi-gear me-2"></i> Settings
					</a>
				</li>
				<li><hr class="dropdown-divider" /></li>
				<li>
					<a
						class="dropdown-item small"
						href="/"
						data-bs-toggle="modal"
						data-bs-target={`#${modalId}`}
					>
						<i class="bi bi-box-arrow-left me-2"></i> Logout
					</a>
				</li>
			</ul>
		</div>
	</div>

	<!-- Logout Modal -->
	<LogoutModal id={modalId} />
</nav>
