<script>
    let { children, mb = 4, border = false, noshadow = false, p = 2 } = $props();
</script>

<div class="card {border ? 'border' : 'border-0'} {noshadow ? '' : 'shadow-sm'} p-{p} mb-{mb}">
    <div class="card-body">
        {@render children?.()}
    </div>
</div>
