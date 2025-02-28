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
import { ICattle } from '@/types/cattle.interface';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formValidationSchema } from '@/validator/sales.validation.schema';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

const salesTypeOptions = [
    {
        value: 'দুধ',
        label: 'দুধ',
    },
    {
        value: 'অন্যান্য',
        label: 'অন্যান্য',
    },
];

export default function AddSales() {
    const [isLoading, setIsLoading] = useState(false);
    const [cattles, setCattles] = useState<ICattle[]>([]);
    const [cattlesMap, setCattlesMap] = useState<Record<string, ICattle>>({});
    const [selectedSalesType, setSelectedSalesType] = useState('');

    const form = useForm({
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            বিক্রয়ের_ধরণ: '',
            বিক্রয়ের_তারিখ: new Date(),
            দুধের_পরিমাণ: '',
            গবাদি_পশুর_ট্যাগ_আইডি: '',
            গবাদি_পশুর_ধরন: '',
            প্রতি_লিটারের_দাম: '',
            মোট_মূল্য: '',
            বিক্রয়_মূল্য: '',
        },
    });
    const router = useRouter();
    const salesType = form.watch('বিক্রয়ের_ধরণ');
    const দুধের_পরিমাণ = form.watch('দুধের_পরিমাণ');
    const প্রতি_লিটারের_দাম = form.watch('প্রতি_লিটারের_দাম');
    const selectedTagId = form.watch('গবাদি_পশুর_ট্যাগ_আইডি');

    useEffect(() => {
        setSelectedSalesType(salesType);
    }, [salesType]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/cattle/get-all-tag-id');
                const { data } = await response.json();

                const cattleMap = data.reduce(
                    (acc: Record<string, ICattle>, cattle: ICattle) => {
                        acc[cattle.ট্যাগ_আইডি] = cattle;
                        return acc;
                    },
                    {}
                );

                setCattles(data);
                setCattlesMap(cattleMap);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Something went wrong.'
                );
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedTagId && cattlesMap[selectedTagId]) {
            form.setValue(
                'গবাদি_পশুর_ধরন',
                cattlesMap[selectedTagId]?.গবাদিপশুর_ধরন || ''
            );
        }
    }, [selectedTagId, cattlesMap, form]);

    useEffect(() => {
        if (selectedSalesType === 'দুধ' && দুধের_পরিমাণ && প্রতি_লিটারের_দাম) {
            const quantity = parseFloat(দুধের_পরিমাণ);
            const pricePerLiter = parseFloat(প্রতি_লিটারের_দাম);

            if (!isNaN(quantity) && !isNaN(pricePerLiter)) {
                const totalPrice = (quantity * pricePerLiter).toFixed(2);
                form.setValue('মোট_মূল্য', totalPrice);
            }
        }
    }, [দুধের_পরিমাণ, প্রতি_লিটারের_দাম, selectedSalesType, form]);

    const onSubmit = async (data: z.infer<typeof formValidationSchema>) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/sales/add-sales`, {
                method: 'POST',

                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('বিক্রয় সফলভাবে যোগ করা হয়েছে!');

                form.reset();

                router.push('/sales');
            }
        } catch (error) {
            toast.error((error as Error).message || 'কিছু ভুল হয়েছে!');
        } finally {
            setIsLoading(false);
        }
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
                                    <SelectOption
                                        data={cattles.map((cattle) => ({
                                            value: cattle.ট্যাগ_আইডি,
                                            label: cattle.ট্যাগ_আইডি,
                                        }))}
                                        form={form}
                                        name="গবাদি_পশুর_ট্যাগ_আইডি"
                                        label="গবাদি পশুর ট্যাগ আইডি"
                                        placeholder="গবাদি পশুর ট্যাগ আইডি নির্বাচন করুন"
                                        required
                                    />

                                    <FormField
                                        control={form.control}
                                        name="গবাদি_পশুর_ধরন"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    গবাদিপশুর ধরন
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="গবাদিপশুর ধরন"
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

                        {selectedSalesType === 'অন্যান্য' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectOption
                                        data={cattles.map((cattle) => ({
                                            value: cattle.ট্যাগ_আইডি,
                                            label: cattle.ট্যাগ_আইডি,
                                        }))}
                                        form={form}
                                        name="গবাদি_পশুর_ট্যাগ_আইডি"
                                        label="গবাদি পশুর ট্যাগ আইডি"
                                        placeholder="গবাদি পশুর ট্যাগ আইডি নির্বাচন করুন"
                                        required
                                    />

                                    <FormField
                                        control={form.control}
                                        name="গবাদি_পশুর_ধরন"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    গবাদিপশুর ধরন
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="গবাদিপশুর ধরন"
                                                        readOnly
                                                        className="bg-gray-50"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="বিক্রয়_মূল্য"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    বিক্রয় মূল্য (৳)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="বিক্রয় মূল্য লিখুন"
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
                            </>
                        )}

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
