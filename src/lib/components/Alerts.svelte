<script>
	import { Alert } from '$lib/stores/alert';
</script>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
	{#each $Alert as { activeId, variant, title, subtitle, message }}
		<div class="toast show" role="alert">
			<div class="toast-header">
				<i class="bi {variant} me-2"></i>
				<strong class="me-auto">{title}</strong>
				<small>{subtitle}</small>
				<button
					type="button"
					class="btn-close"
					onclick={() => Alert.dismiss(activeId)}
					aria-label="close alert button"
				></button>
			</div>
			<div class="toast-body">
				{message}
			</div>
		</div>
	{/each}
</div>
