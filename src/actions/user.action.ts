import { cookies } from 'next/headers';

export async function getUserData() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const res = await fetch(`${process.env.DOMAIN}/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        return data.user;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}
