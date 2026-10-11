import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/dex/dts/inbox/dropdown');

        const data = result.data.data;

        if (result.data.success) {
            return {
                officeList: data,
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
