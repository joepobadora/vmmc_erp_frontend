<!-- script -->
<script>
	import { Alert } from '$lib/stores/alert';

	const modules = [
		{
			abbr: 'DMS',
			name: 'Document Management System',
			desc: 'A centralized platform to create, organize, and securely store documents for easy access and collaboration.',
			icon: 'bi-folder-fill',
			link: '/dms',
			mainte: false
		},
		{
			abbr: 'DTS',
			name: 'Document Tracking System',
			desc: 'Tracks the movement and status of documents in real time to ensure accountability and transparency.',
			icon: 'bi-send-fill',
			link: '/dts',
			mainte: true
		},
		{
			abbr: 'File Transfer',
			name: 'File Transfer Hub',
			desc: 'A fast and secure way to share files across departments and teams without relying on external tools.',
			icon: 'bi-share-fill',
			link: '/file-transfer',
			mainte: true
		},
		{
			abbr: 'Admin',
			name: 'Admin Console',
			desc: 'A centralized dashboard for system administrator. Provides full control over system settings.',
			icon: 'bi-person-fill-lock',
			link: '/admin',
			mainte: true
		}
	];
</script>

<!-- html -->
<div class="h-75 d-flex align-items-center justify-content-center">
	<div class="d-flex gap-4">
		{#each modules as config}
			{#if !config.mainte}
				<a href={config.link} class="text-decoration-none text-dark">
					{@render ModuleCard(config)}
				</a>{:else}
				{@render ModuleCard(config)}
			{/if}
		{/each}
	</div>
</div>

<!-- card snippet -->
{#snippet ModuleCard({ abbr, name, desc, icon, link, mainte })}
	<div
		class={!mainte
			? 'module-card bg-white border shadow d-flex flex-column'
			: 'bg-light border d-flex flex-column'}
		style:width="300px"
		style:height="275px"
	>
		<div class="d-flex gap-4 px-4 pt-3 pb-0">
			<div class="d-flex align-items-center pb-3">
				<i class="bi {icon} {!mainte ? 'text-primary' : 'text-secondary'}"></i>
			</div>
			<div>
				<h6 class={!mainte ? 'text-dark' : 'text-secondary'}>{abbr}</h6>
				<p class="small text-secondary">{name}</p>
			</div>
		</div>
		<hr class="m-0 text-secondary" />
		<div class="h-100 d-flex flex-column px-4 py-3">
			<p class="flex-grow-1 {!mainte ? 'text-dark' : 'text-secondary'}">{desc}</p>
			{#if !mainte}
				<p class="module-link small text-primary mb-0">
					Lauch app<i class="bi bi-box-arrow-up-right ms-2"></i>
				</p>
			{:else}
				<p class="small text-secondary mb-0">Under maintenance</p>
			{/if}
		</div>
	</div>
{/snippet}

<!-- style -->
<style>
	a .module-card:hover {
	}

	a .module-card:hover .module-link {
		text-decoration: underline !important;
	}
</style>
