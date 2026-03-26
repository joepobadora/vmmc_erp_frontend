import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    return {
        id: params.id,
    };
}
