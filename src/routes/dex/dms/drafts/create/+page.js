import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/dex/dms/drafts/create/dropdown');

        const data = result.data.data;

        if (result.data.success) {
            return {
                typeList: data.type,
                tagList: data.tag,
                accountList: data.account,
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
