import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const result = await App.API.get(`/admin/roles/${params.id}`);

        const data = result.data.data;

        if (result.data.success) {
            return {
                code: data.code,
                name: data.name,
                description: data.description,
                status: data.is_active == 1,
                permissions: data.permissions.map((p) => p.code),
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
