import App from '../bootstrap';

class Auth {
    static async loggedIn() {
        const token = localStorage.getItem('access_token');

        if (!token) return false;

        try {
            const result = await App.API.get('/auth');

            if (!result.data.success) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }
}

export default Auth;
