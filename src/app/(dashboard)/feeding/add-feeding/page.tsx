'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { IFeedPurchase } from '@/types/feeding.interface';
import MyCalender from '@/components/shared/MyCalender';
import { Form } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import SelectOption from '@/components/shared/Select';

const feedSchema = z.object({
    feedType: z.string().min(1, 'Feed Type is required'),
    purchaseDate: z.date(),
    quantityPurchased: z.number().positive('Quantity must be greater than 0'),
    perKgPrice: z.number().positive('Price must be greater than 0'),
    totalPrice: z.number().positive('Total Price must be greater than 0'),
    paymentType: z.string().min(1, 'Payment Type is required'),
});

export default function AddFeed() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

    const quantity = form.watch('quantityPurchased');
    const pricePerKg = form.watch('perKgPrice');
    useEffect(() => {
        form.setValue('totalPrice', quantity * pricePerKg);
    }, [quantity, pricePerKg, form]);

    const onSubmit = async (data: IFeedPurchase) => {
        setLoading(true);
        try {
            const response = await fetch(
                '/api/feeding/purchases/add-purchase',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
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
                            <SelectOption
                                data={[
                                    {
                                        value: 'খর',
                                        label: 'খর',
                                    },
                                    {
                                        value: 'ঘাস',
                                        label: 'ঘাস',
                                    },
                                ]}
                                form={form}
                                label="Feed Type"
                                name="feedType"
                                placeholder="Select Feed Type"
                                required
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
                                {...form.register('totalPrice')}
                                disabled
                            />
                        </div>

                        <div>
                            <SelectOption
                                data={[
                                    {
                                        value: 'নগদ',
                                        label: 'নগদ',
                                    },
                                    {
                                        value: 'বাকী',
                                        label: 'বাকী',
                                    },
                                ]}
                                form={form}
                                label="Payment Type"
                                name="paymentType"
                                placeholder="Select Payment Type"
                                required
                            />
                            {form.formState.errors.feedType && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.feedType.message}
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
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Adding...' : 'Add Feed'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
