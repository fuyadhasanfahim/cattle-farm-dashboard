'use server';

import { createSession, deleteSession } from '@/lib/sessions';
import { userLoginValidationSchema } from '@/validator/user.validation.schema';
import { redirect } from 'next/navigation';

interface IPreviousState {
    error: {
        email?: string | undefined;
        password?: string | undefined;
    };
}

export async function ALogin(
    previousState: IPreviousState | undefined,
    formData: FormData
) {
    const result = userLoginValidationSchema.safeParse(
        Object.fromEntries(formData)
    );

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            error: {
                email: fieldErrors.email?.join(', '),
                password: fieldErrors.password?.join(', '),
            },
        };
    }

    const { email, password } = result.data;

    try {
        const response = await fetch(`${process.env.BASE_API!}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const { user } = await response.json();

        await createSession(user?._id);
    } catch (error) {
        console.log(error);
    } finally {
        redirect('/');
    }
}

export async function ALogout() {
    await deleteSession();
    redirect('/login');
}
