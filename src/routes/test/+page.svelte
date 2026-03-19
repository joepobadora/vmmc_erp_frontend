<script>
    import Auth from '../../lib/components/Auth.svelte';

    let auth = $state({
        show: false,
        resolver: null,
        handler: (result) => auth.resolver(result),
        launch: () => {
            auth.show = true;
            return new Promise((resolve) => (auth.resolver = resolve));
        },
    });

    async function doSomething() {
        const confirmed = await auth.launch();

        if (confirmed) {
            console.log('User confirmed:', confirmed);
        } else {
            console.log('User canceled');
        }
    }
</script>

<div class="container">
    <button onclick={doSomething}>launch</button>
</div>

<Auth bind:visibility={auth.show} handler={auth.handler} />
