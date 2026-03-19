<script>
    import Auth from '$lib/components/Auth.svelte';

    let auth = $state();

    async function doSomething() {
        const confirmed = await auth.confirm();

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

<Auth bind:me={auth} />
