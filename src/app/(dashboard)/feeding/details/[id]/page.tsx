'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import MyCalender from '@/components/shared/MyCalender';
import SelectOption from '@/components/shared/Select';
import { IFeedPurchase } from '@/types/feeding.interface';

const feedSchema = z.object({
    feedType: z.string().min(1, 'Feed Type is required'),
    purchaseDate: z.date(),
    quantityPurchased: z.string().nonempty(),
    perKgPrice: z.string().nonempty(),
    totalPrice: z.string().nonempty(),
    paymentType: z.string().min(1, 'Payment Type is required'),
});

export default function FeedingDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [originalTotalPrice, setOriginalTotalPrice] = useState<number>(0);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/feeding/purchases/get-purchase-by-id?id=${id}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const { feedPurchases } = await response.json();

                form.reset({
                    feedType: feedPurchases.feedType as string,
                    purchaseDate: new Date(feedPurchases.purchaseDate),
                    quantityPurchased:
                        feedPurchases.quantityPurchased.toString(),
                    perKgPrice: feedPurchases.perKgPrice.toString(),
                    totalPrice: feedPurchases.totalPrice.toString(),
                    paymentType: feedPurchases.paymentType as string,
                });
                setOriginalTotalPrice(feedPurchases.totalPrice);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form, id]);

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

    const { setError, formState } = form;

    const quantity = form.watch('quantityPurchased');
    const pricePerKg = form.watch('perKgPrice');
    const totalPrice = Number(quantity) * Number(pricePerKg);

    useEffect(() => {
        form.setValue('totalPrice', totalPrice.toString());

        const priceDifference = totalPrice - originalTotalPrice;

        if (priceDifference > 0 && priceDifference > balance) {
            setError('perKgPrice', {
                type: 'manual',
                message: 'You don’t have enough balance for this change.',
            });
        } else if (balance === 0 && priceDifference > 0) {
            setError('perKgPrice', {
                type: 'manual',
                message: 'Cannot increase cost. Your balance is 0.',
            });
        } else {
            form.clearErrors('perKgPrice');
        }
    }, [
        quantity,
        pricePerKg,
        originalTotalPrice,
        balance,
        form,
        setError,
        totalPrice,
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/balance/get-balances');

                const result = await response.json();

                if (response.ok) {
                    setBalance(
                        result.data.reduce(
                            (acc: number, val: { balance: number }) =>
                                acc + val.balance,
                            0
                        ) +
                            result.data.reduce(
                                (acc: number, val: { earning: number }) =>
                                    acc + val.earning,
                                0
                            )
                    );
                }
            } catch (error) {
                toast.error((error as Error).message || 'Something went wrong');
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: z.infer<typeof feedSchema>) => {
        try {
            setLoading(true);

            const payload: IFeedPurchase = {
                feedType: data.feedType,
                purchaseDate: data.purchaseDate,
                quantityPurchased: Number(data.quantityPurchased),
                perKgPrice: Number(data.perKgPrice),
                totalPrice: Number(data.totalPrice),
                paymentType: data.paymentType,
            };

            const response = await fetch(
                `/api/feeding/purchases/update-purchase?id=${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                toast.success('Purchases updated successfully');
                router.push('/feeding');
            } else {
                toast.error('Failed to update data');
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this record?'
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const response = await fetch(
                `/api/feeding/purchases/delete-purchase?id=${id}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                toast.success('Data deleted successfully');
                router.push('/feeding');
            } else {
                toast.error('Failed to delete data.');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Failed to delete data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center h-[83vh] w-full">
            <Card className="max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>
                        <div>Update Feed Purchase</div>
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
                                    {form.formState.isSubmitting
                                        ? 'Updating...'
                                        : 'Update Feed'}
                                </Button>
                                <Button
                                    type="submit"
                                    variant={'destructive'}
                                    disabled={
                                        loading ||
                                        Object.keys(formState.errors).length > 0
                                    }
                                    onClick={() => handleDelete(id as string)}
                                    className="w-full"
                                >
                                    Delete Feed
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
