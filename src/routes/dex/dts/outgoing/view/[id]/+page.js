import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const transactionResult = await App.API.get(`/dex/dts/outgoing/${params.id}`);
        const transactionData = transactionResult.data.data;
        if (!transactionResult.data.success) {
            return {
                error: transactionResult.data.error_code,
            };
        }

        return {
            transaction: transactionData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
