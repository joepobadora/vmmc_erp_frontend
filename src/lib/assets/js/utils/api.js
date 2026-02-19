class API {
    static local = 'http://127.0.0.1:8000/api';
    static live = 'http://172.16.4.220:9100/api';
    static isLive = false;

    // --- Token handling ---
    static setToken(token) {
        if (token) localStorage.setItem('auth_token', token);
        else localStorage.removeItem('auth_token');
    }

    static getToken() {
        return localStorage.getItem('auth_token');
    }

    static removeToken() {
        localStorage.removeItem('auth_token');
    }

    static buildUrl(endpoint) {
        const base = this.isLive ? this.live : this.local;
        return `${base.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    }

    // --- Core request method ---
    static async request(endpoint, method = 'GET', data = null, includeToken = true, responseType = 'json') {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };

            if (includeToken) {
                const token = this.getToken();
                if (token) options.headers['Authorization'] = `Bearer ${token}`;
            }

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(this.buildUrl(endpoint), options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            // Handle different response types
            switch (responseType) {
                case 'json':
                    return await response.json();
                case 'blob':
                    return await response.blob();
                case 'arrayBuffer':
                    return await response.arrayBuffer();
                default:
                    return response;
            }
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            return { success: false, message: error.message };
        }
    }

    // --- Convenience shortcuts ---
    static get(endpoint, responseType = 'json') {
        return this.request(endpoint, 'GET', null, true, responseType);
    }

    static post(endpoint, data, responseType = 'json') {
        return this.request(endpoint, 'POST', data, true, responseType);
    }

    static put(endpoint, data, responseType = 'json') {
        return this.request(endpoint, 'PUT', data, true, responseType);
    }

    static patch(endpoint, data, responseType = 'json') {
        return this.request(endpoint, 'PATCH', data, true, responseType);
    }

    static delete(endpoint, data, responseType = 'json') {
        return this.request(endpoint, 'DELETE', data, true, responseType);
    }

    // --- File download helper ---
    static async download(endpoint, data = null, filename = 'file.pdf') {
        const blob = await this.request(endpoint, 'POST', data, true, 'blob');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }
}

export default API;
