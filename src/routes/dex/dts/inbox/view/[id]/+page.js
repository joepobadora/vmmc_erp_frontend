import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    try {
        const transactionResult = await App.API.get(`/dex/dts/inbox/${params.id}`);
        const transactionData = transactionResult.data.data;
        if (!transactionResult.data.success) {
            return {
                error: transactionResult.data.error_code,
            };
        }

        const tranTransitionsResult = await App.API.get(`/dex/dts/allowed-tran-transitions/${params.id}`);
        const tranTransitionsData = tranTransitionsResult.data.data;
        if (!tranTransitionsResult.data.success) {
            return {
                error: tranTransitionsResult.data.error_code,
            };
        }

        return {
            transaction: transactionData,
            tranTransitions: tranTransitionsData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
