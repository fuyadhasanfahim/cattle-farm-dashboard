'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [data, setData] = useState<{
        email: string;
        password: string;
    }>({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth/login', data, {
                withCredentials: true,
            });

            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Redirect to Dashboard',
                    variant: 'default',
                });

                setData({
                    email: '',
                    password: '',
                });

                router.push('/');
            }
        } catch (error) {
            console.log(error);
            toast({
                title: 'ত্রুটি!',
                description: 'লগইন ব্যর্থ হয়েছে।',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-md">
            <Card className="font-notoSansBengali">
                <CardHeader>
                    <CardTitle className="text-2xl">লগইন</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="email">ইমেইল</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData({ ...data, email: e.target.value })
                                }
                                required={true}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">পাসওয়ার্ড</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                autoComplete="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        password: e.target.value,
                                    })
                                }
                                required={true}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#52aa46]"
                            disabled={isLoading}
                        >
                            {isLoading ? 'লোডিং...' : 'লগইন'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
