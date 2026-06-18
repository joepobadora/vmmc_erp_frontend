import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/dex/dts/drafts/create/dropdown');

        const data = result.data.data;

        if (result.data.success) {
            return {
                routeList: data.routing_method,
                docList: data.valid_documents,
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
