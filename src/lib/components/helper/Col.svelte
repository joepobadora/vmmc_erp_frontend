<script>
    let { children, span = 0, mobile = 12, auto = false } = $props();

    let addClass;

    if (auto) {
        addClass = 'col-auto';
    } else if (span != 0) {
        addClass = `col-${mobile} col-sm-${span}`;
    } else {
        addClass = 'col';
    }
</script>

<div class={addClass}>
    {@render children?.()}
</div>
