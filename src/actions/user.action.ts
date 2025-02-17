import { toast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';

export const loginUser = async (data: { email: string; password: string }) => {
    try {
        const result = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (!result || !result.ok) {
            throw new Error(result?.error || 'Login failed');
        }

        return { success: true };
    } catch (error) {
        toast({
            title: 'ত্রুটি!',
            description:
                (error as Error).message ||
                'তথ্য জমা দেওয়ার সময় একটি ত্রুটি ঘটেছে।',
        });
        return { success: false, error: (error as Error).message };
    }
};
