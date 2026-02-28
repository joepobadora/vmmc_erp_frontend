import App from '$lib/assets/js/bootstrap';

export async function load({ params }) {
    let modules = {
        ADMIN0: false, // admin
        ADMIN1: false, // accounts
        ADMIN2: false, // roles
        ADMIN3: false, // offices
        ADMIN4: false, // doc types
        ADMIN5: false, // doc tags
        ADMIN6: false, // audit trail
        DEX0: false, // dex
        DEX1: false, // dms documents
        DEX2: false, // dms ref copies
        DEX3: false, // dms drafts
        DEX4: false, // dms archive
        DEX5: false, // dms trash
        DEX6: false, // dts incoming
        DEX7: false, // dts inbox
        DEX8: false, // dts outgoing
        DEX9: false, // dts drafts
        DEX10: false, // dts broadcast
        DEX11: false, // dts archive
        DEX12: false, // dts trash
        SEND0: false, // send
        FORMS0: false, // forms
    };

    try {
        const accountResult = await App.API.get(`/admin/accounts/${params.id}`);
        const accountData = accountResult.data.data;
        if (!accountResult.data.success) {
            return {
                error: accountResult.data.error_code,
            };
        }

        accountData.office = accountData.office.short_name;
        accountData.user.suffix_id = Number(accountData.user.suffix_id);
        accountData.user.birthdate = App.Format.date(accountData.user.birthdate).toISODate();
        accountData.role_id = Number(accountData.role_id);

        const activeSet = new Set(accountData.modules.map((m) => m.code));

        Object.entries(modules).forEach(([code]) => {
            modules[code] = activeSet.has(code);
        });

        const dropdownResult = await App.API.get('/admin/accounts/create/dropdown');
        const dropdownData = dropdownResult.data.data;
        if (!dropdownResult.data.success) {
            return {
                error: dropdownResult.data.error_code,
            };
        }

        return {
            suffixList: dropdownData.suffix,
            roleList: dropdownData.role,
            officeList: dropdownData.office,
            account: accountData,
            modules: modules,
        };
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
