import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.DOMAIN || 'http://localhost:3000',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
