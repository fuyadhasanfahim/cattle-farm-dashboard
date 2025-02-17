'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '@/actions/user.action';

interface LoginFormInputs {
    email: string;
    password: string;
}

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
    } = useForm<LoginFormInputs>();
    const router = useRouter();

    const onSubmit = async (data: LoginFormInputs) => {
        const result = await loginUser(data);

        if (result.success) {
            router.push('/');
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">লগইন</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="email">ইমেইল</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                autoComplete="email"
                                {...register('email', {
                                    required: 'ইমেইল প্রয়োজন',
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">পাসওয়ার্ড</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                autoComplete="password"
                                {...register('password', {
                                    required: 'পাসওয়ার্ড প্রয়োজন',
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#52aa46]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                'লগইন'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
