<script>
    import { Alert } from '$lib/stores/alert';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import App from '$lib/assets/js/bootstrap';
    import j from '$lib/components/helper';

    onMount(async () => {
        try {
            const result = await App.API.get('/me');

            const data = result.data.data;

            if (result.data.success) {
                console.log(data);
            } else {
                console.log(result.data.error_code);
            }
        } catch (err) {
            Alert.show('error', 'Bad request.', err.message);
        }
    });
</script>
