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
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SelectOption from '@/components/shared/Select';
import { useEffect, useRef, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { ICustomer } from '@/types/customer.interface';

const customerTypeOptions = [
    {
        value: 'খুচরা',
        label: 'খুচরা',
    },
    {
        value: 'পাইকারি',
        label: 'পাইকারি',
    },
];

const customerFormSchema = z.object({
    নাম: z.string().min(1, 'নাম প্রয়োজন'),
    মোবাইল_নম্বর: z.string().min(1, 'মোবাইল নম্বর প্রয়োজন'),
    ঠিকানা: z.string().min(1, 'ঠিকানা প্রয়োজন'),
    গ্রাহকের_ধরণ: z.string().min(1, 'গ্রাহকের ধরণ প্রয়োজন'),
    মন্তব্য: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function UpdateCustomer() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ICustomer | null>(null);
    const { id } = useParams();

    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            নাম: '',
            মোবাইল_নম্বর: '',
            ঠিকানা: '',
            গ্রাহকের_ধরণ: '',
            মন্তব্য: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/customers/get-customer-by-id?id=${id}`
                );

                const { data } = await response.json();

                setData(data);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, setData]);

    const isFormReset = useRef(false);

    useEffect(() => {
        if (data && !isFormReset.current) {
            form.reset({
                নাম: data.নাম || '',
                মোবাইল_নম্বর: data.মোবাইল_নম্বর || '',
                ঠিকানা: data.ঠিকানা || '',
                গ্রাহকের_ধরণ: data.গ্রাহকের_ধরণ || '',
                মন্তব্য: data.মন্তব্য || '',
            });
            isFormReset.current = true;
        }
    }, [data, form]);

    const onSubmit = async (data: CustomerFormValues) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `/api/customers/update-customer?id=${id}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                toast.success('গ্রাহক সফলভাবে আপডেট হয়েছে!');

                window.history.back();
            }
        } catch (error) {
            toast.error((error as Error).message || 'কিছু ভুল হয়েছে!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="font-notoSansBengali">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-green-600">
                        গ্রাহকের তথ্য আপডেট করুন
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
                                    name="নাম"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>নাম</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="গ্রাহকের নাম লিখুন"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="মোবাইল_নম্বর"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>মোবাইল নম্বর</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="মোবাইল নম্বর লিখুন"
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
                                    name="ঠিকানা"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ঠিকানা</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="ঠিকানা লিখুন"
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
                                    label="গ্রাহকের ধরণ"
                                    name="গ্রাহকের_ধরণ"
                                    placeholder="গ্রাহকের ধরণ লিখুন"
                                />
                            </div>

                            {/* মন্তব্য Field */}
                            <FormField
                                control={form.control}
                                name="মন্তব্য"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>মন্তব্য</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="মন্তব্য লিখুন"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <Button type="submit" className="btn-primary">
                                    {isLoading ? (
                                        <Loader2 size={20} />
                                    ) : (
                                        <Save size={20} />
                                    )}

                                    <span>
                                        {isLoading
                                            ? 'সংরক্ষণ করা হচ্ছে...'
                                            : 'সংরক্ষণ করুন'}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
    );
}
