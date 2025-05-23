'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SelectOption from '@/components/shared/Select';
import { useState } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const customerTypeOptions = [
    {
        value: 'Retail',
        label: 'Retail',
    },
    {
        value: 'Wholesale',
        label: 'Wholesale',
    },
];

const customerFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    mobileNumber: z.string().min(1, 'Mobile number is required'),
    address: z.string().min(1, 'Address is required'),
    customerType: z.string().min(1, 'Customer type is required'),
    comments: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function AddCustomer() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            name: '',
            mobileNumber: '',
            address: '',
            customerType: '',
            comments: '',
        },
    });

    const onSubmit = async (data: CustomerFormValues) => {
        try {
            setIsLoading(true);

            const response = await fetch(`/api/customers/add-customer`, {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Customer added successfully!');

                form.reset();

                router.push('/customers');
            } else {
                toast.error('Failed to add customer.');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-green-600">
                        Add New Customer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter customer name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Mobile Number *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter mobile number"
                                                    type="tel"
                                                    maxLength={11}
                                                    onInput={(e) => {
                                                        const value = (
                                                            e.target as HTMLInputElement
                                                        ).value.replace(
                                                            /[^0-9]/g,
                                                            ''
                                                        );
                                                        if (
                                                            value &&
                                                            value[0] !== '0'
                                                        ) {
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).value =
                                                                '0' +
                                                                value.slice(1);
                                                        } else {
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).value = value;
                                                        }
                                                        field.onChange(e);
                                                    }}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <SelectOption
                                    data={customerTypeOptions}
                                    form={form}
                                    label="Customer Type"
                                    name="customerType"
                                    placeholder="Select customer type"
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="comments"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Comments (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter comments"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <div className="flex items-center gap-6">
                                    <Button
                                        onClick={() => router.back()}
                                        type="button"
                                        variant={'outline'}
                                    >
                                        <ArrowLeft className="size-5" />
                                        <span>Back</span>
                                    </Button>

                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <Loader2 size={20} />
                                        ) : (
                                            <Save size={20} />
                                        )}

                                        <span>
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
