'use server';

import { redirect } from 'next/navigation';

export async function ALogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        throw new Error('Please enter both email and password.');
    }

    try {
        console.log({ email, password });
    } catch (error) {
        throw new Error((error as Error).message);
    } finally {
        redirect('/');
    }
}
