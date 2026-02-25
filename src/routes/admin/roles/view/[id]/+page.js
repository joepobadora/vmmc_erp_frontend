import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const result = await App.API.get(`/admin/roles/${params.id}`);

        if (result.success) {
            return {
                code: result.data.code,
                name: result.data.name,
                description: result.data.description,
                status: result.data.is_active == 1,
                permissions: result.data.permissions.map((p) => p.code),
            };
        } else {
            return {
                error: result.error_code,
            };
        }
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
