import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.DOMAIN!,
    headers: {
        'Content-Type': 'application/json',
        timeout: 1000,
    },
});

export default axiosInstance;
