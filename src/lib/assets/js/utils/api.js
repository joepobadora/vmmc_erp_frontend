import axios from 'axios';

const baseURL = 'http://127.0.0.1:8080/api';

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

export default API;
