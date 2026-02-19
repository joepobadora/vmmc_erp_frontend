import API from './api';

class Auth {
    static async loggedIn() {
        const token = API.getToken();

        if (!token) return false;

        try {
            const result = await API.get('/auth');

            if (!result.success) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }
}

export default Auth;
