import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/admin/accounts/dropdown');

        const data = result.data.data;

        if (result.data.success) {
            return {
                roleList: data.role,
                officeList: data.office,
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
