import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/admin/accounts/create/dropdown');

        if (result.success) {
            return {
                suffixList: result.data.suffix,
                roleList: result.data.role,
                officeList: result.data.office,
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
