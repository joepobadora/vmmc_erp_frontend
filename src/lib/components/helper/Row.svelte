<script>
    let {
        children,
        mb = 3,

        centerx = false,
        startx = false,
        endx = false,

        centery = false,
        starty = false,
        endy = false,
    } = $props();

    const justify = centerx ? 'justify-content-center' : startx ? 'justify-content-start' : endx ? 'justify-content-end' : '';

    const align = centery ? 'align-items-center' : starty ? 'align-items-start' : endy ? 'align-items-end' : '';
</script>

<div class={`row mb-${mb} ${justify} ${align}`}>
    {@render children?.()}
</div>
