'use server';

import axios from 'axios';

export async function getUserInfo() {
    try {
        const res = await axios.get('/api/auth/profile');

        console.log(res);
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}
