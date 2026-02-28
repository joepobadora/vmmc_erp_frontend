import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const result = await App.API.get(`/admin/document-types/${params.id}`);

        const data = result.data.data;

        if (result.data.success) {
            return {
                name: data.name,
                status: data.is_active == 1,
            };
        } else {
            return {
                error: result.data.error_code,
            };
        }
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
