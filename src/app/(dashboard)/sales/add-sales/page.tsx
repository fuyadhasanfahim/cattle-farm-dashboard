'use client';

import SelectOption from '@/components/shared/Select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Plus, Save, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ISales } from '@/types/sales.interface';

export const dynamic = 'force-dynamic';

const paymentTypeOptions = [
    {
        value: 'টাকা',
        label: 'টাকা',
    },
    {
        value: 'অনলাইন পেমেন্ট',
        label: 'অনলাইন পেমেন্ট',
    },
    {
        value: 'ব্যাংক পেমেন্ট',
        label: 'ব্যাংক পেমেন্ট',
    },
];

const salesTypeOptions = [
    {
        value: 'দুধ',
        label: 'দুধ',
    },
    {
        value: 'মাছ',
        label: 'মাছ',
    },
    {
        value: 'ছাগল',
        label: 'ছাগল',
    },
    {
        value: 'গরু',
        label: 'গরু',
    },
    {
        value: 'অন্যান্য',
        label: 'অন্যান্য',
    },
];

const formValidationSchema = z.object({
    বিক্রয়ের_ধরণ: z
        .string()
        .min(1, { message: 'বিক্রয়ের ধরণ নির্বাচন করুন' }),
    বিক্রয়ের_তারিখ: z.coerce.date(), // Ensuring date type
    গ্রাহকের_মোবাইল_নম্বর: z
        .string()
        .min(1, { message: 'গ্রাহকের মোবাইল নম্বর আবশ্যক' }),
    গ্রাহকের_নাম: z.string().min(1, { message: 'গ্রাহকের নাম আবশ্যক' }),
    দুধের_পরিমাণ: z.number().optional(),
    প্রতি_লিটারের_দাম: z.number().optional(),
    মোট_মূল্য: z.number().optional(),
    পরিশোধিত_পরিমাণ: z.number().min(1),
    পরিশোধ_পদ্ধতি: z
        .string()
        .min(1, { message: 'পরিশোধ পদ্ধতি নির্বাচন করুন' }),
    বকেয়া_পরিমাণ: z.number().min(1),
});

export default function AddSales() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [availableMilk, setAvailableMilk] = useState(0);
    const [selectedSalesType, setSelectedSalesType] = useState('');

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            বিক্রয়ের_ধরণ: '',
            বিক্রয়ের_তারিখ: new Date(),
            দুধের_পরিমাণ: 0,
            গ্রাহকের_মোবাইল_নম্বর: '',
            গ্রাহকের_নাম: '',
            প্রতি_লিটারের_দাম: 0,
            মোট_মূল্য: 0,
            পরিশোধিত_পরিমাণ: 0,
            পরিশোধ_পদ্ধতি: '',
            বকেয়া_পরিমাণ: 0,
        },
    });
    const router = useRouter();
    const salesType = form.watch('বিক্রয়ের_ধরণ');
    const দুধের_পরিমাণ = form.watch('দুধের_পরিমাণ');
    const প্রতি_লিটারের_দাম = form.watch('প্রতি_লিটারের_দাম');
    const গ্রাহকের_মোবাইল_নম্বর = form.watch('গ্রাহকের_মোবাইল_নম্বর');

    useEffect(() => {
        setSelectedSalesType(salesType);
    }, [salesType]);

    useEffect(() => {
        if (salesType === 'দুধ') {
            fetchAvailableMilk();
        }
    }, [salesType]);

    const fetchAvailableMilk = async () => {
        try {
            const response = await fetch(
                '/api/milk-production/get-available-milk'
            );
            const { data } = await response.json();

            if (response.ok) {
                setAvailableMilk(data.মোট_দুধের_পরিমাণ || 0);
            } else {
                toast.error('দুধের স্টক তথ্য লোড করতে সমস্যা হয়েছে');
            }
        } catch (error) {
            toast.error(
                (error as Error).message ||
                    'দুধের স্টক তথ্য লোড করতে সমস্যা হয়েছে'
            );
        }
    };

    useEffect(() => {
        if (selectedSalesType === 'দুধ' && দুধের_পরিমাণ && প্রতি_লিটারের_দাম) {
            const quantity = দুধের_পরিমাণ;
            const pricePerLiter = প্রতি_লিটারের_দাম;

            if (!isNaN(quantity) && !isNaN(pricePerLiter)) {
                const totalPrice = (quantity * pricePerLiter).toFixed(2);
                form.setValue('মোট_মূল্য', parseFloat(totalPrice));
            }
        }
    }, [দুধের_পরিমাণ, প্রতি_লিটারের_দাম, selectedSalesType, form]);

    const searchCustomer = async () => {
        if (!গ্রাহকের_মোবাইল_নম্বর || গ্রাহকের_মোবাইল_নম্বর.length < 3) {
            toast.error('সঠিক ফোন নম্বর প্রদান করুন');
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `/api/customers/get-customer-by-phone-number?mobile_number=${গ্রাহকের_মোবাইল_নম্বর}`
            );
            const { data } = await response.json();

            console.log(data);

            if (response.ok) {
                form.setValue('গ্রাহকের_নাম', data.নাম || '');
                toast.success('গ্রাহক খুঁজে পাওয়া গেছে');
            } else {
                form.setValue('গ্রাহকের_নাম', '');
                toast.error('গ্রাহক খুঁজে পাওয়া যায়নি');
            }
        } catch (error) {
            toast.error(
                (error as Error).message || 'গ্রাহক খোঁজার সময় সমস্যা হয়েছে'
            );
        } finally {
            setIsSearching(false);
        }
    };

    const onSubmit = async (data: ISales) => {
        if (data.বিক্রয়ের_ধরণ === 'দুধ') {
            if (data.দুধের_পরিমাণ) {
                const requestedQuantity = data.দুধের_পরিমাণ;
                if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
                    toast.error('দুধের সঠিক পরিমাণ প্রদান করুন');
                    return;
                }

                if (requestedQuantity > availableMilk) {
                    toast.error(
                        `পর্যাপ্ত দুধ নেই। স্টকে আছে ${availableMilk} লিটার`
                    );
                    return;
                }

                if (!data.গ্রাহকের_মোবাইল_নম্বর || !data.গ্রাহকের_নাম) {
                    toast.error('গ্রাহকের তথ্য প্রদান করুন');
                    return;
                }
            }
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/sales/add-sales`, {
                method: 'POST',
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('বিক্রয় সফলভাবে যোগ করা হয়েছে!');
                form.reset();
                router.push('/sales');
            } else {
                toast.error(result.message || 'কিছু ভুল হয়েছে!');
            }
        } catch (error) {
            toast.error((error as Error).message || 'কিছু ভুল হয়েছে!');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToAddCustomer = () => {
        if (গ্রাহকের_মোবাইল_নম্বর) {
            localStorage.setItem('tempCustomerPhone', গ্রাহকের_মোবাইল_নম্বর);
        }
        router.push('/customers/add-customer');
    };

    return (
        <Card className="font-notoSansBengali">
            <CardHeader>
                <CardTitle className="text-3xl text-green-600 font-semibold">
                    সম্পূর্ণ তথ্য প্রদান করে বিক্রয় যোগ করুন
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectOption
                                data={salesTypeOptions}
                                form={form}
                                name="বিক্রয়ের_ধরণ"
                                label="বিক্রয়ের ধরণ"
                                placeholder="বিক্রয়ের ধরণ নির্বাচন করুন"
                                required
                            />

                            <FormField
                                control={form.control}
                                name="বিক্রয়ের_তারিখ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>বিক্রয়ের তারিখ</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                'PPP'
                                                            )
                                                        ) : (
                                                            <span>
                                                                তারিখ নির্বাচন
                                                                করুন
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            field.onChange(
                                                                date
                                                            );
                                                        }
                                                    }}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date <
                                                            new Date(
                                                                '1900-01-01'
                                                            )
                                                    }
                                                    initialFocus
                                                    required
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {selectedSalesType === 'দুধ' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <FormField
                                            control={form.control}
                                            name="গ্রাহকের_মোবাইল_নম্বর"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        গ্রাহকের ফোন নম্বর
                                                    </FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="গ্রাহকের ফোন নম্বর লিখুন"
                                                                type="text"
                                                                required
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                searchCustomer
                                                            }
                                                            disabled={
                                                                isSearching
                                                            }
                                                        >
                                                            {isSearching ? (
                                                                <Loader2 className="size-4 animate-spin" />
                                                            ) : (
                                                                <Search className="size-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                navigateToAddCustomer
                                                            }
                                                            className="bg-green-50 hover:bg-green-100"
                                                        >
                                                            <Plus className="size-4 text-green-600" />
                                                        </Button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="গ্রাহকের_নাম"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    গ্রাহকের নাম
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="গ্রাহকের নাম"
                                                        readOnly
                                                        className="bg-gray-50"
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
                                        name="দুধের_পরিমাণ"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    দুধের পরিমাণ (লিটার)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="দুধের পরিমাণ লিখুন"
                                                        type="text"
                                                        required
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <p className="text-xs text-amber-600 mt-1">
                                                    স্টকে উপলব্ধ:{' '}
                                                    {availableMilk} লিটার
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="প্রতি_লিটারের_দাম"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    প্রতি লিটারের দাম (৳)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="প্রতি লিটারের দাম লিখুন"
                                                        type="text"
                                                        required
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
                                        name="মোট_মূল্য"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    মোট মূল্য (৳)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="মোট মূল্য"
                                                        type="text"
                                                        className="bg-gray-50 font-medium text-green-700"
                                                        readOnly
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="পরিশোধিত_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            পরিশোধিত পরিমাণ (৳)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="পরিশোধিত পরিমাণ লিখুন"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="বকেয়া_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>বকেয়া পরিমাণ (৳)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="বকেয়া পরিমাণ লিখুন"
                                                type="text"
                                                readOnly
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SelectOption
                                data={paymentTypeOptions}
                                form={form}
                                name="বিক্রয়ের_ধরণ"
                                label="বিক্রয়ের ধরণ"
                                placeholder="বিক্রয়ের ধরণ নির্বাচন করুন"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-center pt-4">
                            <Button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 h-12 rounded-md font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-5 mr-2 animate-spin" />
                                        <span>প্রক্রিয়াকরণ হচ্ছে...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-5 mr-2" />
                                        <span>সংরক্ষন করুন</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
