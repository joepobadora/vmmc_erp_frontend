import App from '../bootstrap';
import { modules, permissions } from '$lib/stores/access';

class Auth {
    static async loggedIn() {
        const token = localStorage.getItem('access_token');

        if (!token) return false;

        try {
            const authResult = await App.API.get('/auth');
            const meResult = await App.API.get('/me');

            const meData = meResult.data.data;

            if (!authResult.data.success || !meResult.data.success) {
                return false;
            }

            modules.set(await meData.modules.map((m) => m.code));
            permissions.set(await meData.role.permissions.map((p) => p.code));

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default Auth;
