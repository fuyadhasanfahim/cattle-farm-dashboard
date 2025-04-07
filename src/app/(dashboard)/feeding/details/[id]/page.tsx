'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { IFeedPurchase } from '@/types/feeding.interface';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import MyCalender from '@/components/shared/MyCalender';

const feedSchema = z.object({
    feedType: z.string().min(1, 'Feed Type is required'),
    purchaseDate: z.date(),
    quantityPurchased: z.number().positive('Quantity must be greater than 0'),
    perKgPrice: z.number().positive('Price must be greater than 0'),
    totalPrice: z.number().positive('Total Price must be greater than 0'),
    paymentType: z.string().min(1, 'Payment Type is required'),
});

export default function FeedingDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<number>(0);
    const [originalTotalPrice, setOriginalTotalPrice] = useState<number>(0);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(feedSchema),
        defaultValues: {
            feedType: '',
            purchaseDate: new Date(),
            quantityPurchased: 0,
            perKgPrice: 0,
            totalPrice: 0,
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

                const result = await response.json();

                form.reset({
                    feedType: result.feedPurchases.feedType,
                    purchaseDate: new Date(result.feedPurchases.purchaseDate),
                    quantityPurchased: result.feedPurchases.quantityPurchased,
                    perKgPrice: result.feedPurchases.perKgPrice,
                    totalPrice: result.feedPurchases.totalPrice,
                    paymentType: result.feedPurchases.paymentType,
                });
                setOriginalTotalPrice(result.feedPurchases.totalPrice);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form, id]);

    const { setError, formState } = form;

    const quantity = form.watch('quantityPurchased');
    const pricePerKg = form.watch('perKgPrice');

    useEffect(() => {
        const newTotalPrice = quantity * pricePerKg;
        form.setValue('totalPrice', newTotalPrice);

        const priceDifference = newTotalPrice - originalTotalPrice;

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
    }, [quantity, pricePerKg, originalTotalPrice, balance, form, setError]);

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
                        )
                    );
                }
            } catch (error) {
                toast.error((error as Error).message || 'Something went wrong');
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: IFeedPurchase) => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/feeding/purchases/update-purchase?id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                toast.success('Purchases updated successfully');
                router.push('/feeding');
            } else {
                throw new Error('Failed to update data');
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
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Add Feed Purchase</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <MyCalender
                            form={form}
                            label="Select Purchase Date"
                            name="purchaseDate"
                        />

                        <div>
                            <Label htmlFor="feedType">Feed Type</Label>
                            <Input
                                {...form.register('feedType')}
                                placeholder="Enter feed type"
                            />
                            {form.formState.errors.feedType && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.feedType.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="quantityPurchased">
                                Quantity (kg)
                            </Label>
                            <Input
                                type="number"
                                {...form.register('quantityPurchased', {
                                    valueAsNumber: true,
                                })}
                                placeholder="Enter quantity"
                            />
                            {form.formState.errors.quantityPurchased && (
                                <p className="text-red-500 text-sm">
                                    {
                                        form.formState.errors.quantityPurchased
                                            .message
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="perKgPrice">Price per Kg</Label>
                            <Input
                                type="number"
                                {...form.register('perKgPrice', {
                                    valueAsNumber: true,
                                })}
                                placeholder="Enter price per kg"
                            />
                            {form.formState.errors.perKgPrice && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.perKgPrice.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="totalPrice">Total Price</Label>
                            <Input
                                type="number"
                                {...form.register('totalPrice', {
                                    valueAsNumber: true,
                                })}
                                disabled
                            />
                        </div>

                        <div>
                            <Label htmlFor="paymentType">Payment Type</Label>
                            <Input
                                {...form.register('paymentType')}
                                placeholder="Enter payment type"
                            />
                            {form.formState.errors.paymentType && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.paymentType.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <Button
                                type="button"
                                variant={'outline'}
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
                                    Object.keys(formState.errors || {}).length >
                                        0
                                }
                                className="w-full"
                            >
                                {loading ? 'Updating...' : 'Update Feed'}
                            </Button>

                            <Button
                                type="button"
                                variant={'destructive'}
                                disabled={loading}
                                className="w-full"
                                onClick={() => handleDelete(id as string)}
                            >
                                Delete Record
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
