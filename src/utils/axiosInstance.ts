import axios from 'axios';
import { redirect } from 'next/navigation';

const axiosInstance = axios.create({
    baseURL: `${process.env.DOMAIN!}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            return redirect('/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
