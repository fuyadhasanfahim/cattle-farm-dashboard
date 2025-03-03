'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
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
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ISales } from '@/types/sales.interface';
import { Loader2 } from 'lucide-react';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const salesFormSchema = z.object({
    বিক্রয়ের_ধরণ: z.string().min(1, 'বিক্রয়ের ধরণ আবশ্যক'),
    বিক্রয়ের_তারিখ: z.date(),
    গ্রাহকের_নাম: z.string().min(1, 'গ্রাহকের নাম আবশ্যক'),
    গ্রাহকের_মোবাইল_নম্বর: z.string().min(11, 'সঠিক মোবাইল নম্বর দিন').max(14),
    দুধের_পরিমাণ: z.string().min(1, 'দুধের পরিমাণ আবশ্যক'),
    পরিশোধ_পদ্ধতি: z.string().min(1, 'পরিশোধ পদ্ধতি আবশ্যক'),
    পরিশোধিত_পরিমাণ: z.string().min(1, 'পরিশোধিত পরিমাণ আবশ্যক'),
    প্রতি_লিটারের_দাম: z.string().min(1, 'প্রতি লিটারের দাম আবশ্যক'),
    বকেয়া_পরিমাণ: z.string(),
    মোট_মূল্য: z.string().min(1, 'মোট মূল্য আবশ্যক'),
});

export default function AddSales() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [dueAmount, setDueAmount] = useState(0);
    const [showAddCustomerButton, setShowAddCustomerButton] = useState(false);
    const [availableMilk, setAvailableMilk] = useState<number | null>(null);
    const [isLoadingMilk, setIsLoadingMilk] = useState(true);
    const route = useRouter();

    const form = useForm<ISales>({
        resolver: zodResolver(salesFormSchema),
        defaultValues: {
            বিক্রয়ের_ধরণ: 'দুধ',
            বিক্রয়ের_তারিখ: new Date(),
            গ্রাহকের_নাম: '',
            গ্রাহকের_মোবাইল_নম্বর: '',
            দুধের_পরিমাণ: '',
            পরিশোধ_পদ্ধতি: '',
            পরিশোধিত_পরিমাণ: '',
            প্রতি_লিটারের_দাম: '',
            বকেয়া_পরিমাণ: dueAmount.toString(),
            মোট_মূল্য: '',
        },
    });

    useEffect(() => {
        const fetchAvailableMilk = async () => {
            setIsLoadingMilk(true);
            try {
                const response = await axios.get(
                    '/api/milk-production/get-available-milk'
                );
                if (response.data.success) {
                    setAvailableMilk(response.data.data.মোট_দুধের_পরিমাণ || 0);
                } else {
                    setAvailableMilk(0);
                    toast.error('দুধের পরিমাণ পাওয়া যায়নি।');
                }
            } catch (error) {
                console.error('Error fetching available milk:', error);
                setAvailableMilk(0);
                toast.error('দুধের পরিমাণ পাওয়া যায়নি।');
            } finally {
                setIsLoadingMilk(false);
            }
        };

        fetchAvailableMilk();
    }, []);

    useEffect(() => {
        const quantity = parseFloat(form.getValues('দুধের_পরিমাণ') || '0');
        const pricePerLiter = parseFloat(
            form.getValues('প্রতি_লিটারের_দাম') || '0'
        );
        const paidAmount = parseFloat(form.getValues('পরিশোধিত_পরিমাণ') || '0');

        if (quantity && pricePerLiter) {
            const totalPrice = quantity * pricePerLiter;
            form.setValue('মোট_মূল্য', totalPrice.toString());

            if (paidAmount) {
                const due = totalPrice - paidAmount;
                setDueAmount(due);
                form.setValue('বকেয়া_পরিমাণ', due.toString());
            }
        }
    }, [form]);

    useEffect(() => {
        const quantity = parseFloat(form.getValues('দুধের_পরিমাণ') || '0');

        if (availableMilk !== null && quantity > availableMilk) {
            toast.error(
                `উপলব্ধ দুধের পরিমাণ ${availableMilk} লিটার। অতিরিক্ত বিক্রি করা যাবে না।`
            );
            form.setValue('দুধের_পরিমাণ', availableMilk.toString());
        }
    }, [availableMilk, form]);

    const handlePhoneSearch = async (phoneNumber: string) => {
        if (phoneNumber.length >= 11) {
            setSearchLoading(true);
            setShowAddCustomerButton(false);

            try {
                const response = await axios.get(
                    `/api/customers/get-customer-by-phone-number?mobile_number=${phoneNumber}`
                );

                if (response.data && response.data.data.নাম) {
                    form.setValue('গ্রাহকের_নাম', response.data.data.নাম);
                } else {
                    form.setValue('গ্রাহকের_নাম', '');
                    setShowAddCustomerButton(true);
                }
            } catch (error) {
                console.error('Error searching for customer:', error);
                setShowAddCustomerButton(true);
            } finally {
                setSearchLoading(false);
            }
        }
    };

    const handleAddCustomer = () => {
        route.push(`/customers/add-customer`);
    };

    const onSubmit = async (data: ISales) => {
        setIsLoading(true);

        try {
            const quantity = parseFloat(data.দুধের_পরিমাণ);
            if (availableMilk !== null && quantity > availableMilk) {
                toast.error(
                    `উপলব্ধ দুধের পরিমাণ ${availableMilk} লিটার। অতিরিক্ত বিক্রি করা যাবে না।`
                );
                setIsLoading(false);
                return;
            }

            const response = await axios.post('/api/sales/add-sales', data);

            if (response.status === 200 || response.status === 201) {
                toast.success('সফল! বিক্রয় সফলভাবে যোগ করা হয়েছে।');

                await axios.put(
                    '/api/milk-production/only-update-milk-ammount',
                    {
                        দুধের_পরিমাণ: data.দুধের_পরিমাণ,
                    }
                );

                setAvailableMilk((prev) =>
                    prev !== null ? prev - quantity : null
                );

                form.reset();

                route.push('/sales');
            }
        } catch (error) {
            toast.error(
                (error as Error).message ||
                    'ত্রুটি! বিক্রয় যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="font-notoSansBengali">
            <CardHeader>
                <CardTitle>দুধ বিক্রি করুন</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="বিক্রয়ের_ধরণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>বিক্রয়ের ধরণ</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled
                                                value="দুধ"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="বিক্রয়ের_তারিখ"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
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
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="গ্রাহকের_মোবাইল_নম্বর"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            গ্রাহকের মোবাইল নম্বর
                                        </FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="01XXXXXXXXX"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handlePhoneSearch(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            {searchLoading && (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="গ্রাহকের_নাম"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>গ্রাহকের নাম</FormLabel>
                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input {...field} readOnly />
                                            </FormControl>
                                            {showAddCustomerButton && (
                                                <Button
                                                    type="button"
                                                    onClick={handleAddCustomer}
                                                >
                                                    নতুন গ্রাহক যোগ করুন
                                                </Button>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="দুধের_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center justify-between">
                                            <span>দুধের পরিমাণ (লিটার)</span>
                                            {isLoadingMilk ? (
                                                <span className="text-sm text-muted-foreground flex items-center">
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    দুধের পরিমাণ লোড করা
                                                    হচ্ছে...
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    উপলব্ধ:{' '}
                                                    {availableMilk !== null
                                                        ? `${availableMilk} লিটার`
                                                        : 'অজানা'}
                                                </span>
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                max={
                                                    availableMilk !== null
                                                        ? availableMilk
                                                        : undefined
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="প্রতি_লিটারের_দাম"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            প্রতি লিটারের দাম (টাকা)
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="মোট_মূল্য"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>মোট মূল্য (টাকা)</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="পরিশোধ_পদ্ধতি"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>পরিশোধ পদ্ধতি</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="পরিশোধ পদ্ধতি নির্বাচন করুন" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="নগদ">
                                                    নগদ
                                                </SelectItem>
                                                <SelectItem value="মোবাইল পেমেন্ট">
                                                    মোবাইল পেমেন্ট
                                                </SelectItem>
                                                <SelectItem value="ব্যাংক ট্রান্সফার">
                                                    ব্যাংক ট্রান্সফার
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="পরিশোধিত_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            পরিশোধিত পরিমাণ (টাকা)
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="বকেয়া_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            বকেয়া পরিমাণ (টাকা)
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                                    প্রক্রিয়াকরণ হচ্ছে...
                                </>
                            ) : (
                                'বিক্রয় যোগ করুন'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
