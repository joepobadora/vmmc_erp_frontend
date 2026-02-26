import App from '$lib/assets/js/bootstrap';

export async function load() {
    try {
        const result = await App.API.get('/settings');

        const data = result.data.data;

        if (result.data.success) {
            return {
                username: data.account.username,
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                firstName: data.user.first_name,
                middleName: data.user.middle_name,
                lastName: data.user.last_name,
                suffixList: data.suffix_list,
                suffix: data.user.suffix_id ?? 0,
                gender: data.user.gender,
                birthdate: App.Format.date(data.user.birthdate).toISODate(),
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
