'use server';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function getUserData() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null;
        }

        const res = await fetch(`${process.env.DOMAIN}/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch user data: ${res.statusText}`);
        }

        const data = await res.json();
        return data.user;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}
