import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const dropdownResult = await App.API.get('/dex/dms/documents/dropdown');
        const dropdownData = dropdownResult.data.data;
        if (!dropdownResult.data.success) {
            return {
                error: dropdownResult.data.error_code,
            };
        }

        const statsResult = await App.API.get('/dex/dms/documents/stats');
        const statsData = statsResult.data.data;
        if (!statsResult.data.success) {
            return {
                error: statsResult.data.error_code,
            };
        }

        return {
            tagList: dropdownData,
            stats: statsData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
