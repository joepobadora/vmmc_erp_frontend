import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const documentResult = await App.API.get(`/dex/dms/drafts/${params.id}`);
        const documentData = documentResult.data.data;
        if (!documentResult.data.success) {
            return {
                error: documentResult.data.error_code,
            };
        }

        return {
            document: documentData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }

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
