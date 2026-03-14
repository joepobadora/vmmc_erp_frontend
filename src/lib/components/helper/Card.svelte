<script>
    let { children, mb = 4, borderonly = false, p = 2 } = $props();
</script>

<div class="card {borderonly ? '' : 'shadow-sm border-0'} p-{p} mb-{mb}">
    <div class="card-body">
        {@render children?.()}
    </div>
</div>
