import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const result = await App.API.get(`/admin/offices/${params.id}`);

        const data = result.data.data;

        if (result.data.success) {
            return {
                division: data.division,
                department: data.department,
                abbreviation: data.abbreviation,
                office: data.office,
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
