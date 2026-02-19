<script>
    import { goto } from '$app/navigation';
    import App from '$lib/assets/js/bootstrap';
    import { onMount } from 'svelte';

    // route guard
    let auth = null;

    onMount(async () => {
        auth = await App.Auth.loggedIn();

        if (auth) {
            goto('/');
        }
    });
</script>

<svelte:head>
    <title>VMMC ERP - Login</title>
</svelte:head>

<!-- main -->
<div class="container flex-grow-1">
    <div class="row vh-100">
        <div class="col-sm-12"><slot /></div>
    </div>
</div>
