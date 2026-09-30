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

        const TranTransitionsResult = await App.API.get(`/dex/dts/allowed-tran-transitions/${params.id}`);
        const TranTransitionsData = TranTransitionsResult.data.data;
        if (!TranTransitionsResult.data.success) {
            return {
                error: TranTransitionsResult.data.error_code,
            };
        }

        return {
            transaction: transactionData,
            TranTransitions: TranTransitionsData,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
