import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const documentResult = await App.API.get(`/dex/dms/documents/${params.id}`);
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
}
