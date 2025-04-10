'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import MyCalender from '@/components/shared/MyCalender';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import SelectOption from '@/components/shared/Select';

const feedSchema = z.object({
    feedType: z.string().min(1, 'Feed Type is required'),
    purchaseDate: z.date(),
    quantityPurchased: z.string().nonempty(),
    perKgPrice: z.string().nonempty(),
    totalPrice: z.string().nonempty(),
    paymentType: z.string().min(1, 'Payment Type is required'),
});

export default function AddFeed() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [balance, setBalance] = useState(0);

    const form = useForm({
        resolver: zodResolver(feedSchema),
        defaultValues: {
            feedType: '',
            purchaseDate: new Date(),
            quantityPurchased: '',
            perKgPrice: '',
            totalPrice: '',
            paymentType: '',
        },
    });

    const { setError, formState } = form;
    const quantity = form.watch('quantityPurchased');
    const pricePerKg = form.watch('perKgPrice');
    const totalPrice = Number(quantity) * Number(pricePerKg);

    useEffect(() => {
        form.setValue('totalPrice', totalPrice.toString());

        if (totalPrice > balance) {
            setError('totalPrice', {
                type: 'custom',
                message: 'Total price exceeds available balance',
            });
        } else {
            form.clearErrors('totalPrice');
        }
    }, [quantity, pricePerKg, totalPrice, balance, form, setError]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBalanceLoading(true);
                const response = await fetch('/api/balance/get-balances');
                const result = await response.json();
                if (response.ok) {
                    setBalance(
                        result.data.reduce(
                            (acc: number, val: { balance: number }) =>
                                acc + val.balance,
                            0
                        )
                    );
                }
            } catch (error) {
                toast.error((error as Error).message || 'Something went wrong');
            } finally {
                setBalanceLoading(false);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: z.infer<typeof feedSchema>) => {
        setLoading(true);
        try {
            const response = await fetch(
                '/api/feeding/purchases/add-purchase',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        feedType: data.feedType,
                        purchaseDate: data.purchaseDate,
                        quantityPurchased: Number(data.quantityPurchased),
                        perKgPrice: Number(data.perKgPrice),
                        totalPrice: Number(data.totalPrice),
                        paymentType: data.paymentType,
                    }),
                }
            );

            if (response.ok) {
                toast.success('Feed added successfully!');
                form.reset();
                router.back();
            } else {
                toast.error('Failed to add feed.');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center h-[83vh] w-full">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>
                        <div>Add Feed Purchase</div>
                        <div>
                            <span className="text-sm text-gray-500">
                                Balance:{' '}
                                {balanceLoading ? 'Loading...' : balance} Taka
                            </span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-2 gap-x-6 gap-y-4 items-center"
                        >
                            <MyCalender
                                form={form}
                                label="Select Purchase Date"
                                name="purchaseDate"
                            />

                            <SelectOption
                                data={[
                                    {
                                        value: 'Dung',
                                        label: 'Dung',
                                    },
                                    {
                                        value: 'Grass',
                                        label: 'Grass',
                                    },
                                    {
                                        value: 'Grain Feed',
                                        label: 'Grain Feed',
                                    },
                                ]}
                                form={form}
                                label="Feed Type"
                                name="feedType"
                                placeholder="Select Feed Type"
                                required
                            />

                            <FormField
                                control={form.control}
                                name="quantityPurchased"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity (kg)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter quantity"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="perKgPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Kg</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter price per kg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="totalPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SelectOption
                                data={[
                                    {
                                        value: 'Paid',
                                        label: 'Paid',
                                    },
                                    {
                                        value: 'Pending',
                                        label: 'Pending',
                                    },
                                ]}
                                form={form}
                                label="Payment Type"
                                name="paymentType"
                                placeholder="Select Payment Type"
                                required
                            />

                            <div className="flex items-center gap-6 w-full col-span-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={loading}
                                    className="w-full"
                                    onClick={() => router.back()}
                                >
                                    <ArrowLeft />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        Object.keys(formState.errors).length > 0
                                    }
                                    className="w-full"
                                >
                                    {loading ? 'Adding...' : 'Add Feed'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
