import axios from 'axios';

// const baseURL = 'http://localhost/api';
const baseURL = 'http://172.16.4.230/api';

// Create Axios instance
const API = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: add token automatically from localStorage
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    config.headers['X-Client-Route'] = window.location.pathname;
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized - redirecting to login');

            localStorage.removeItem('access_token');

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default API;
