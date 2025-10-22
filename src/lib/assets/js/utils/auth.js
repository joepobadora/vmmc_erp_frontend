import API from './api';

class Auth {
    static async loggedIn() {
        const token = API.getToken();

        // 1️⃣ No token at all
        if (!token) return false;

        try {
            const result = await API.get('http://127.0.0.1:8000/api/auth');

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
