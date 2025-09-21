<script>
	import { Alert } from '$lib/stores/alert';

	const modules = [
		{ name: 'DMS', desc: 'Document Management System', icon: 'bi-folder-fill', link: '/dms' },
		{ name: 'DTS', desc: 'Document Tracking System', icon: 'bi-send-fill', link: '/dts' },
		{
			name: 'File Transfer',
			desc: 'File Transfer Hub',
			icon: 'bi-share-fill',
			link: '/file-transfer'
		}
	];
</script>

<!-- html -->
<div class="h-100 d-flex align-items-center justify-content-center">
	<div class="d-flex gap-3">
		{#each modules as module}
			<a href={module.link} class="text-decoration-none text-dark">
				<div class="card shadow-sm px-2" style:width="275px" style:height="175px">
					<div class="card-body d-flex flex-column">
						<div class="d-flex gap-3 align-items-top flex-grow-1">
							<i class="bi {module.icon} text-primary"></i>
							<div>
								<h6>{module.name}</h6>
								<p class="small text-secondary">{module.desc}</p>
							</div>
						</div>
						<p class="small text-decoration-underline text-primary">
							LAUNCH APP<i class="bi bi-box-arrow-up-right ms-2"></i>
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	a .card:hover {
		background-color: whitesmoke;
	}
</style>
