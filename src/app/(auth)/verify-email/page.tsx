'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Check, AlertCircle, Mail } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
    const [token, setToken] = useState<string>('');
    const [verified, setVerified] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        }
    }, [searchParams]);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) return;

            setIsLoading(true);
            try {
                await axios.post('/api/auth/verify-email', { token });
                setVerified(true);
                setError(false);
                toast({
                    title: 'Success!',
                    description: 'Your email has been verified successfully.',
                    variant: 'default',
                });
            } catch (error) {
                setError(true);
                toast({
                    title: 'Verification Failed',
                    description:
                        (error as Error).message ||
                        'Failed to verify email. Please try again.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token]);

    return (
        <section className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md transform rounded-xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <Mail className="h-10 w-10 text-gray-600" />
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-full animate-spin rounded-full border-b-2 border-gray-600"></div>
                            </div>
                        )}
                    </div>

                    <h1 className="text-center text-2xl font-bold text-gray-800">
                        {!token
                            ? 'Email Verification'
                            : 'Verifying your email...'}
                    </h1>

                    {!token && (
                        <p className="text-center text-gray-600">
                            No verification token found. Please check your email
                            for the verification link.
                        </p>
                    )}

                    {verified && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="rounded-full bg-green-100 p-3">
                                <Check className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-lg font-medium text-green-600">
                                Email verified successfully!
                            </h2>
                            <Button className="mt-4 w-full transform transition-transform duration-200 hover:scale-105">
                                <Link href="/login" className="w-full">
                                    Proceed to Login
                                </Link>
                            </Button>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="rounded-full bg-red-100 p-3">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h2 className="text-lg font-medium text-red-600">
                                Verification Failed
                            </h2>
                            <p className="text-center text-gray-600">
                                Unable to verify your email. Please try again or
                                contact support.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4 w-full transform transition-transform duration-200 hover:scale-105"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
