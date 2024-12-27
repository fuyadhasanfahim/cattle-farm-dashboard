'use server';

import { createSession, deleteSession } from '@/lib/sessions';
import { userLoginValidationSchema } from '@/validator/user.validation.schema';
import { redirect } from 'next/navigation';

interface IPreviousState {
    error: {
        email?: string | undefined;
        password?: string | undefined;
    };
    success?: boolean;
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
                email: fieldErrors.email
                    ? fieldErrors.email.join(', ')
                    : undefined,
                password: fieldErrors.password
                    ? fieldErrors.password.join(', ')
                    : undefined,
            },
        };
    }

    const { email, password } = result.data;

    try {
        const response = await fetch(
            `${process.env.BASE_API!}/api/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            }
        );

        if (!response.ok) {
            const { message, field } = await response.json();

            return {
                error: {
                    email: field === 'email' ? message : undefined,
                    password: field === 'password' ? message : undefined,
                },
            };
        }

        if (response.status === 200) {
            const { user } = await response.json();
            await createSession(user?._id);

            return {
                error: {
                    email: undefined,
                    password: undefined,
                },
                success: true,
            };
        }
    } catch (error) {
        console.log(error);

        return {
            error: {
                email:
                    (error as Error).message || 'An unexpected error occurred.',
                password: undefined,
            },
        };
    }

    return {
        error: {
            email: undefined,
            password: undefined,
        },
    };
}

export async function ALogout() {
    await deleteSession();
    redirect('/login');
}
