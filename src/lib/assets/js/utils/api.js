class API {
    static setToken(token) {
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    static getToken() {
        return localStorage.getItem('auth_token');
    }

    static removeToken() {
        localStorage.removeItem('auth_token');
    }

    static async request(endpoint, method = 'GET', data = null, includeToken = true) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };

            // Attach Authorization header if token exists and requested
            if (includeToken) {
                const token = localStorage.getItem('auth_token');

                if (token) {
                    options.headers['Authorization'] = `Bearer ${token}`;
                }
            }

            // Only send body if needed
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(endpoint, options);

            // validate http response
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            // validate result
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            return { success: false, message: error.message };
        }
    }

    // Shortcuts for common methods
    static get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    static post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }

    static put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    }

    static patch(endpoint, data) {
        return this.request(endpoint, 'PATCH', data);
    }

    static delete(endpoint, data) {
        return this.request(endpoint, 'DELETE', data);
    }
}

export default API;
