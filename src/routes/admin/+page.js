import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get(`/admin/dashboard`);

        const data = result.data.data;

        if (result.data.success) {
            return {
                accountsTotal: data.accountsTotal,
                accountsActive: data.accountsActive,
                rolesTotal: data.rolesTotal,
                rolesActive: data.rolesActive,
                officesTotal: data.officesTotal,
                officesActive: data.officesActive,
                docTypesTotal: data.docTypesTotal,
                docTypesActive: data.docTypesActive,
                docTagsTotal: data.docTagsTotal,
                docTagsActive: data.docTagsActive,
                systemActivity: data.systemActivity,
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
