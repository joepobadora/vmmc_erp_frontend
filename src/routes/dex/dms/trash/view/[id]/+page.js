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

        const docTransitionsResult = await App.API.get(`/dex/dms/allowed-doc-transitions/${params.id}`);
        const docTransitionsData = docTransitionsResult.data.data;
        if (!docTransitionsResult.data.success) {
            return {
                error: docTransitionsResult.data.error_code,
            };
        }

        const userTransitionsResult = await App.API.get(`/dex/dms/allowed-user-transitions/${params.id}`);
        const userTransitionsData = userTransitionsResult.data.data;
        if (!userTransitionsResult.data.success) {
            return {
                error: userTransitionsResult.data.error_code,
            };
        }

        const userActionResult = await App.API.get(`/dex/dms/user-action/${params.id}`);
        const userActionData = userActionResult.data.data;
        if (!userActionResult.data.success) {
            return {
                error: userActionResult.data.error_code,
            };
        }

        return {
            document: documentData,
            docTransitions: docTransitionsData,
            userTransitions: userTransitionsData,
            userAction: userActionData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
