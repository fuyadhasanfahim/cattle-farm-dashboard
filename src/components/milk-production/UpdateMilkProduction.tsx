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
import { Input } from '../ui/input';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { IMilkProduction } from '@/types/milk.production.interface';
import { ICattle } from '@/types/cattle.interface';

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
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [cattles, setCattles] = useState<ICattle[] | []>([]);
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            দুধ_সংগ্রহের_তারিখ: new Date(),
            গবাদি_পশুর_ট্যাগ_আইডি: '',
            গবাদি_পশুর_ধরণ: '',
            মোট_দুধের_পরিমাণ: '',
            বিক্রি_যোগ্য_দুধের_পরিমাণ: '',
            খাওয়ার_জন্য_দুধের_পরিমাণ: '',
            ফ্যাট_শতাংশ: '',
            সময়: '',
        },
    });

    const totalMilkAmount = form.watch('মোট_দুধের_পরিমাণ');
    const saleableMilkAmount = form.watch('বিক্রি_যোগ্য_দুধের_পরিমাণ');
    const cattleTagId = form.watch('গবাদি_পশুর_ট্যাগ_আইডি');

    useEffect(() => {
        const fetchMilkProductionData = async () => {
            setFetchingData(true);
            try {
                const response = await fetch(
                    `/api/milk-production/get-milk-production-by-id?id=${id}`
                );
                if (!response.ok)
                    throw new Error('Failed to fetch milk production data');

                const data = await response.json();

                form.reset({
                    দুধ_সংগ্রহের_তারিখ: data.দুধ_সংগ্রহের_তারিখ
                        ? new Date(data.দুধ_সংগ্রহের_তারিখ)
                        : new Date(),
                    গবাদি_পশুর_ট্যাগ_আইডি: data.গবাদি_পশুর_ট্যাগ_আইডি || '',
                    গবাদি_পশুর_ধরণ: data.গবাদি_পশুর_ধরণ || '',
                    মোট_দুধের_পরিমাণ: data.মোট_দুধের_পরিমাণ || '',
                    বিক্রি_যোগ্য_দুধের_পরিমাণ:
                        data.বিক্রি_যোগ্য_দুধের_পরিমাণ || '',
                    খাওয়ার_জন্য_দুধের_পরিমাণ:
                        data.খাওয়ার_জন্য_দুধের_পরিমাণ || '',
                    ফ্যাট_শতাংশ: data.ফ্যাট_শতাংশ || '',
                    সময়: data.সময় || '',
                });
            } catch (error) {
                toast.error(
                    (error as Error).message ||
                        'দুধ উৎপাদন তথ্য আনতে ব্যর্থ হয়েছে'
                );
            } finally {
                setFetchingData(false);
            }
        };

        fetchMilkProductionData();
    }, [id, form]);

    useEffect(() => {
        const fetchCattleData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/cattle/get-all-tag-id');
                if (!response.ok)
                    throw new Error('Failed to fetch cattle data');

                const { data } = await response.json();
                setCattles(data);
            } catch (error) {
                toast.error(
                    (error as Error).message ||
                        'গবাদি পশুর তথ্য আনতে ব্যর্থ হয়েছে'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchCattleData();
    }, []);

    useEffect(() => {
        const totalMilk = Number(totalMilkAmount) || 0;
        const saleableMilk = Number(saleableMilkAmount) || 0;
        const milkForHome = totalMilk - saleableMilk;

        form.setValue('খাওয়ার_জন্য_দুধের_পরিমাণ', milkForHome.toString());
    }, [totalMilkAmount, saleableMilkAmount, form]);

    useEffect(() => {
        if (!cattleTagId || cattles.length === 0) return;

        const selectedCattle = cattles.find(
            (cattle) =>
                cattle.ট্যাগ_আইডি === String(cattleTagId) ||
                parseFloat(cattle.ট্যাগ_আইডি) === Number(cattleTagId)
        );

        if (selectedCattle) {
            form.setValue('গবাদি_পশুর_ধরণ', selectedCattle.গবাদিপশুর_ধরন || '');
        }
    }, [cattleTagId, cattles, form]);

    const onSubmit = async (data: IMilkProduction) => {
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/milk-production/update-milk-production?id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success('দুধ উৎপাদন তথ্য সফলভাবে আপডেট করা হয়েছে।');
                router.push('/milk-production');
            } else {
                toast.error(
                    result.message ||
                        'দুধ উৎপাদন তথ্য আপডেট করতে ব্যর্থ হয়েছে।'
                );
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <Card className="font-notoSansBengali">
                <CardHeader>
                    <CardTitle>দুধ উৎপাদন তথ্য আপডেট</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-10">
                    <Loader2 className="size-8 animate-spin" />
                    <span className="ml-2">তথ্য লোড হচ্ছে...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="font-notoSansBengali">
            <CardHeader>
                <CardTitle>দুধ উৎপাদন তথ্য আপডেট</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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

                            <SelectOption
                                data={milkingOptions}
                                form={form}
                                name="সময়"
                                label="দুধ দোহনের সময়"
                                placeholder="দুধ দোহনের সময় নির্বাচন করুন"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <SelectOption
                                data={
                                    cattles.length > 0
                                        ? cattles.map((c) => ({
                                              value: c.ট্যাগ_আইডি,
                                              label: c.ট্যাগ_আইডি,
                                          }))
                                        : [{ value: 'N/A', label: 'N/A' }]
                                }
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
                                                type="text"
                                                readOnly
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
                                name="মোট_দুধের_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>মোট দুধের পরিমাণ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="মোট দুধের পরিমাণ লিখুন"
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value || 0;
                                                    field.onChange(value);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="বিক্রি_যোগ্য_দুধের_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            বিক্রি যোগ্য দুধের পরিমাণ
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="বিক্রি যোগ্য দুধের পরিমাণ লিখুন"
                                                max={totalMilkAmount || 0}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value || 0;
                                                    field.onChange(value);
                                                }}
                                                value={field.value}
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
                                name="খাওয়ার_জন্য_দুধের_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            খাওয়ার জন্য দুধের পরিমাণ
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="খাওয়ার জন্য দুধের পরিমাণ"
                                                readOnly
                                                className="bg-gray-50"
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ফ্যাট_শতাংশ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            ফ্যাট শতাংশ (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="ফ্যাট শতাংশ লিখুন"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                onChange={(e) => {
                                                    let value =
                                                        e.target.value || 0;
                                                    if (Number(value) > 100)
                                                        value = 100;
                                                    field.onChange(value);
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <Save className="size-5" />
                                )}
                                <span>আপডেট করুন</span>
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
