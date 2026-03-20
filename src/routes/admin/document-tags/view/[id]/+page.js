import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const dropdownResult = await App.API.get('/admin/document-tags/create/dropdown');
        const dropdownData = dropdownResult.data.data;

        if (!dropdownResult.data.success) {
            return {
                error: dropdownResult.data.error_code,
            };
        }

        const documentTagResult = await App.API.get(`/admin/document-tags/${params.id}`);
        const documentTagData = documentTagResult.data.data;

        if (!documentTagResult.data.success) {
            return {
                error: documentTagResult.data.error_code,
            };
        }

        documentTagData.office = documentTagData.office.short_name;
        documentTagData.status = documentTagData.is_active == 1;

        return {
            officeList: dropdownData,
            documentTag: documentTagData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
