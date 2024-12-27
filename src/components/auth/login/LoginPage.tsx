'use client';

import { ALogin } from '@/actions/user.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

export default function LoginPage() {
    const [state, loginAction] = useActionState(ALogin, undefined);
    const { pending } = useFormStatus();

    return (
        <div className="flex flex-col gap-6 w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">লগইন</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={loginAction}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">ইমেইল</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                    required
                                />
                                {state?.error?.email && (
                                    <p className="text-red-500 text-sm">
                                        {state?.error?.email}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">পাসওয়ার্ড</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="******"
                                    autoComplete="password"
                                    required
                                />
                                {state?.error?.password && (
                                    <p className="text-red-500 text-sm">
                                        {state?.error?.password}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#52aa46]"
                                disabled={pending}
                            >
                                লগইন
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
