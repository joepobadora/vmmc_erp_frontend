<script>
    import App from '$lib/assets/js/bootstrap';
    import { onMount } from 'svelte';

    onMount(async () => {
        try {
            const result = await App.API.post('http://127.0.0.1:8000/api/route-guard', {
                route: '/admin',
            });

            if (result.success) {
                console.log(result.allowed);
            }
        } catch (err) {
            console.log(err.message);
        }
    });
</script>
