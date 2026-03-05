import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const result = await App.API.get(`/admin/audit-logs/${params.id}`);

        const data = result.data.data;

        if (result.data.success) {
            return data;
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
