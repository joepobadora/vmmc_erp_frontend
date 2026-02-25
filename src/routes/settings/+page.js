import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/settings');

        if (result.success) {
            return {
                username: result.data.account.username,
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                firstName: result.data.user.first_name,
                middleName: result.data.user.middle_name,
                lastName: result.data.user.last_name,
                suffixList: result.data.suffix_list,
                suffix: result.data.user.suffix_id ?? 0,
                gender: result.data.user.gender,
                birthdate: App.Format.date(result.data.user.birthdate).toISODate(),
            };
        } else {
            return {
                error: result.error_code,
            };
        }
    } catch (err) {
        return {
            error: err.message,
        };
    }
}
