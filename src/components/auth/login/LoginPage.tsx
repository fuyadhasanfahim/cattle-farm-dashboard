'use client';

import { LoginAction } from '@/actions/user.action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">লগইন</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={LoginAction}>
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
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#52aa46]"
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
