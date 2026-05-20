import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const documentResult = await App.API.get(`/dex/dms/trash/${params.id}`);
        const documentData = documentResult.data.data;
        if (!documentResult.data.success) {
            return {
                error: documentResult.data.error_code,
            };
        }

        const dropdownResult = await App.API.get('/dex/dms/drafts/create/dropdown');
        const dropdownData = dropdownResult.data.data;
        if (!dropdownResult.data.success) {
            return {
                error: dropdownResult.data.error_code,
            };
        }

        return {
            typeList: dropdownData.type,
            tagList: dropdownData.tag,
            accountList: dropdownData.account,
            document: documentData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
