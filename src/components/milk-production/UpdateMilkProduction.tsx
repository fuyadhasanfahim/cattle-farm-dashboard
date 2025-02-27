'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import SelectOption from '../shared/Select';
import toast from 'react-hot-toast';
import { ICattle } from '@/types/cattle.interface';
import { Input } from '../ui/input';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { milkProductionValidationSchema } from '@/validator/milk.production.validation.schema';

const milkingOptions = [
    {
        value: 'সকাল',
        label: 'সকাল',
    },
    {
        value: 'দুপুর',
        label: 'দুপুর',
    },
    {
        value: 'বিকেল',
        label: 'বিকেল',
    },
    {
        value: 'সন্ধ্যা',
        label: 'সন্ধ্যা',
    },
];

export default function UpdateMilkProduction() {
    const [isLoading, setIsLoading] = useState(false);
    const [cattles, setCattles] = useState<ICattle[]>([]);
    const [cattlesMap, setCattlesMap] = useState<Record<string, ICattle>>({});
    const router = useRouter();
    const { id } = useParams();

    const form = useForm<z.infer<typeof milkProductionValidationSchema>>({
        resolver: zodResolver(milkProductionValidationSchema),
        defaultValues: {
            গবাদি_পশুর_ট্যাগ_আইডি: '',
            গবাদি_পশুর_ধরণ: '',
            দুধ_সংগ্রহের_তারিখ: new Date(),
            দুধের_পরিমাণ: '',
            ফ্যাট_শতাংশ: '',
            সময়: '',
        },
    });

    const selectedTagId = form.watch('গবাদি_পশুর_ট্যাগ_আইডি');

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
        const fetchMilkProductionData = async () => {
            try {
                const response = await fetch(
                    `/api/milk-production/get-milk-production-by-id?id=${id}`
                );
                const result = await response.json();

                form.setValue(
                    'গবাদি_পশুর_ট্যাগ_আইডি',
                    result.গবাদি_পশুর_ট্যাগ_আইডি
                );
                form.setValue('গবাদি_পশুর_ধরণ', result.গবাদি_পশুর_ধরণ);
                form.setValue(
                    'দুধ_সংগ্রহের_তারিখ',
                    new Date(result.দুধ_সংগ্রহের_তারিখ)
                );
                form.setValue('দুধের_পরিমাণ', result.দুধের_পরিমাণ);
                form.setValue('ফ্যাট_শতাংশ', result.ফ্যাট_শতাংশ);
                form.setValue('সময়', result.সময়);

                console.log('Form Values After Setting:', form.getValues());
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Something went wrong.'
                );
            }
        };

        fetchMilkProductionData();
    }, [form, id]);

    useEffect(() => {
        if (selectedTagId && cattlesMap[selectedTagId]) {
            form.setValue(
                'গবাদি_পশুর_ধরণ',
                cattlesMap[selectedTagId]?.গবাদিপশুর_ধরন || ''
            );
        }
    }, [selectedTagId, cattlesMap, form]);

    const onSubmit = async (
        data: z.infer<typeof milkProductionValidationSchema>
    ) => {
        setIsLoading(true);

        try {
            const response = await fetch(
                '/api/milk-production/update-milk-production',
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                toast.success('দুধ উৎপাদন তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।');
                router.push('/milk-production');
            } else {
                toast.error('দুধ উৎপাদন তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>দুধ সংগ্রহের ফর্ম</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-6">
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
                                name="গবাদি_পশুর_ধরণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>গবাদি পশুর ধরণ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="গবাদি পশুর ধরণ"
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

                        <div className="flex items-center gap-6">
                            <FormField
                                control={form.control}
                                name="দুধ_সংগ্রহের_তারিখ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            দুধ সংগ্রহের তারিখ
                                        </FormLabel>
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

                            <FormField
                                control={form.control}
                                name="ফ্যাট_শতাংশ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>ফ্যাট শতাংশ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ফ্যাট শতাংশ লিখুন"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <SelectOption
                                data={milkingOptions}
                                form={form}
                                name="সময়"
                                label="দুধ দোহনের সময়"
                                placeholder="দুধ দোহনের সময় নির্বাচন করুন"
                                required
                            />

                            <FormField
                                control={form.control}
                                name="দুধের_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>দুধের পরিমাণ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="দুধের_পরিমাণ লিখুন"
                                                type="number"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <button type="submit" className="btn-primary">
                                {isLoading ? (
                                    <Loader2 className="size-5" />
                                ) : (
                                    <Save className="size-5" />
                                )}
                                <span>সংরক্ষন করুন</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
