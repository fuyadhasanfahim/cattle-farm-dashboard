/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import MyCalender from '@/components/shared/MyCalender';
import SelectOption from '@/components/shared/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ISales } from '@/types/sales.interface';
import { salesValidationSchema } from '@/validator/sales.validation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AddSales() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [milkAmount, setMilkAmount] = useState(0);
    const [isMilkLoading, setIsMilkLoading] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<ISales>({
        resolver: zodResolver(salesValidationSchema),
        defaultValues: {
            salesType: 'Milk',
            salesDate: new Date(),
            buyersPhoneNumber: '',
            buyersName: '',
            milkQuantity: 0,
            perLiterPrice: 0,
            totalPrice: 0,
            paymentAmount: 0,
            paymentMethod: '',
            dueAmount: 0,
        },
    });

    const handlePhoneSearch = async (phoneNumber: string) => {
        if (phoneNumber.length >= 11) {
            setIsSearching(true);

            try {
                const response = await fetch(
                    `/api/customers/get-customer-by-phone-number?mobile_number=${phoneNumber}`
                );

                const result = await response.json();

                if (result && result.success === true) {
                    form.setValue('buyersName', result.data.name);
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsSearching(false);
            }
        }
    };

    useEffect(() => {
        const fetchMilkData = async () => {
            try {
                setIsMilkLoading(true);

                const response = await fetch('/api/milk/get-milk-amount');

                const result = await response.json();

                setMilkAmount(result?.data?.saleMilkAmount || 0);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsMilkLoading(false);
            }
        };

        fetchMilkData();
    }, []);

    useEffect(() => {
        const milkQuantity = form.getValues('milkQuantity') || 0;
        const perLiterPrice = form.getValues('perLiterPrice') || 0;
        const paymentAmount = form.getValues('paymentAmount') || 0;

        const totalPrice = milkQuantity * perLiterPrice;
        const dueAmount = totalPrice - paymentAmount;

        if (form.getValues('totalPrice') !== totalPrice) {
            form.setValue('totalPrice', totalPrice, { shouldValidate: true });
        }
        if (form.getValues('dueAmount') !== dueAmount) {
            form.setValue('dueAmount', dueAmount, { shouldValidate: true });
        }
    }, [
        form,
        form.watch('milkQuantity'),
        form.watch('perLiterPrice'),
        form.watch('paymentAmount'),
    ]);

    const onSubmit = async (data: ISales) => {
        try {
            setIsSubmitting(true);

            const response = await fetch(`/api/sales/add-sales`, {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(
                    'Successfully created the sales. Redirecting to sales'
                );

                form.reset();

                router.push('/sales');
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle className="text-3xl">Add Sales</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="salesType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sales Type</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Set the sales type"
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <MyCalender
                                form={form}
                                label="Select the sales Date"
                                name="salesDate"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="buyersPhoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Buyers Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Search for customer"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handlePhoneSearch(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="buyersName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Buyers Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={
                                                    isSearching
                                                        ? 'Searching the customer'
                                                        : 'Customer name'
                                                }
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="milkQuantity"
                                rules={{
                                    required: 'Milk quantity is required',
                                    min: {
                                        value: 1,
                                        message:
                                            'Milk quantity must be at least 1 liter',
                                    },
                                    max: {
                                        value: milkAmount,
                                        message: `Cannot exceed ${milkAmount} liters`,
                                    },
                                    validate: (value) =>
                                        !isNaN(value) ||
                                        'Must be a valid number',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center justify-between">
                                            <span>Milk quantity (Liter)</span>
                                            {isMilkLoading ? (
                                                <span className="text-sm text-muted-foreground flex items-center">
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    Loading milk quantity
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    Available:{' '}
                                                    {milkAmount !== null
                                                        ? `${milkAmount.toFixed(
                                                              2
                                                          )} Liter`
                                                        : 'Unknown'}
                                                </span>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Set the quantity"
                                                {...field}
                                                type="number"
                                                onChange={(e) => {
                                                    const value = Number(
                                                        e.target.value
                                                    );
                                                    if (
                                                        !isNaN(value) &&
                                                        value <= milkAmount &&
                                                        value >= 1
                                                    ) {
                                                        field.onChange(value);
                                                    } else {
                                                        field.onChange('');
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="perLiterPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Liter</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Set the price Per liter"
                                                {...field}
                                                value={field.value ?? 0}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="totalPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Set the price Per liter"
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SelectOption
                                form={form}
                                label="Select Payment Method"
                                data={[
                                    { value: 'Cash', label: 'Cash' },
                                    { value: 'Pending', label: 'Pending' },
                                ]}
                                name="paymentMethod"
                                placeholder="Select payment method"
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="paymentAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Payment amount"
                                                {...field}
                                                value={field.value ?? 0}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dueAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Set due amount"
                                                {...field}
                                                readOnly
                                                value={field.value ?? 0}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={cn(
                                    'btn-primary',
                                    isSubmitting
                                        ? 'bg-muted cursor-not-allowed'
                                        : ''
                                )}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
