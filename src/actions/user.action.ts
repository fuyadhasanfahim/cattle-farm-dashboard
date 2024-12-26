'use server';

import { redirect } from 'next/navigation';

const baseApi = process.env.BASE_API!;

export async function ALogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        throw new Error('Please enter both email and password.');
    }

    try {
        await fetch(`${baseApi}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            redirect: 'manual',
        });
    } catch (error) {
        throw new Error((error as Error).message);
    } finally {
        redirect('/');
    }
}
