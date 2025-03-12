'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ICattle } from '@/types/cattle.interface';
import { CalendarIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import SelectOption from '@/components/shared/Select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';

const genderOptions = [
    { value: 'পুরুষ', label: 'পুরুষ' },
    { value: 'মহিলা', label: 'মহিলা' },
];

const cattleTypeOptions = [
    { value: 'গরু', label: 'গরু' },
    { value: 'মহিষ', label: 'মহিষ' },
    { value: 'ছাগল', label: 'ছাগল' },
];

const categoryOptions = [
    { value: 'দুগ্ধ', label: 'দুগ্ধ' },
    { value: 'মাংস', label: 'মাংস' },
    { value: 'দুগ্ধ ও মাংস', label: 'দুগ্ধ ও মাংস' },
];

const deathStatusOptions = [
    { value: 'জীবিত', label: 'জীবিত' },
    { value: 'মৃত', label: 'মৃত' },
];

const fatteningStatusOptions = [
    { value: 'এক্টিভ', label: 'এক্টিভ' },
    { value: 'ইনএক্টিভ', label: 'ইনএক্টিভ' },
];

const transferStatusOptions = [
    { value: 'খামারে অবস্থিত', label: 'খামারে অবস্থিত' },
    { value: 'বিক্রি হয়েছে', label: 'বিক্রি হয়েছে' },
];

export default function EditCattleData() {
    const { id } = useParams();
    const [cattleData, setCattleData] = useState<ICattle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const form = useForm<ICattle>({
        defaultValues: {
            ট্যাগ_আইডি: cattleData?.ট্যাগ_আইডি,
            রেজিষ্ট্রেশনের_তারিখ: cattleData?.রেজিষ্ট্রেশনের_তারিখ,
            জন্ম_তারিখ: cattleData?.জন্ম_তারিখ,
            বয়স: cattleData?.বয়স,
            স্টল_নম্বর: cattleData?.স্টল_নম্বর,
            জাত: cattleData?.জাত,
            বাবার_নাম: cattleData?.বাবার_নাম,
            বাবার_আইডি: cattleData?.বাবার_আইডি,
            মায়ের_নাম: cattleData?.মায়ের_নাম,
            মায়ের_আইডি: cattleData?.মায়ের_আইডি,
            পার্সেন্টেজ: cattleData?.পার্সেন্টেজ,
            ওজন: cattleData?.ওজন,
            লিঙ্গ: cattleData?.লিঙ্গ,
            মোটাতাজা_করন_স্ট্যাটাস: cattleData?.মোটাতাজা_করন_স্ট্যাটাস,
            গবাদিপশুর_ধরন: cattleData?.গবাদিপশুর_ধরন,
            গবাদিপশুর_ক্যাটাগরি: cattleData?.গবাদিপশুর_ক্যাটাগরি,
            অবস্থান: cattleData?.অবস্থান,
            অবস্থা: cattleData?.অবস্থা,
            বিবরন: cattleData?.বিবরন,
        },
    });

    const calculateAge = (birthDate: Date) => {
        const now = new Date();
        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const ageParts: string[] = [];
        if (years > 0) ageParts.push(`${years} বছর`);
        if (months > 0) ageParts.push(`${months} মাস`);
        if (days > 0) ageParts.push(`${days} দিন`);

        return ageParts.join(' ');
    };

    const handleBirthDateChange = (date: Date) => {
        form.setValue('জন্ম_তারিখ', date);
        form.setValue('বয়স', calculateAge(date));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(`/api/cattle/get-cattle?id=${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                if (!data) {
                    throw new Error('Could not find the specified Data.');
                }

                setCattleData(data?.cattle);

                form.reset(data?.cattle);
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : 'An error occurred'
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, form]);

    if (!cattleData) {
        return (
            <div className="w-full flex h-[calc(100vh-80px)] items-center justify-center">
                <h3 className="text-lg">No data found</h3>
            </div>
        );
    }

    const onSubmit = async (data: ICattle) => {
        try {
            setIsLoading(true);

            const response = await fetch(`/api/cattle/update-cattle?id=${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update cattle data');
            }

            const result = await response.json();

            if (result.success) {
                toast.success('Cattle data updated successfully!');
            } else {
                throw new Error(
                    result.message || 'Failed to update cattle data'
                );
            }

            router.push(`/manage-cattles`);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'An error occurred'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="">Editing cattle Data: {id}</CardTitle>
            </CardHeader>
            <CardContent className="">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-6">
                            <FormField
                                control={form.control}
                                name="ট্যাগ_আইডি"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>ট্যাগ আইডি</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="পশুর ট্যাগ আইডি লিখুন"
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="রেজিষ্ট্রেশনের_তারিখ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>রেজিষ্ট্রেশন তাং</FormLabel>
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
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <FormField
                                control={form.control}
                                name="জন্ম_তারিখ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>জন্ম তারিখ</FormLabel>
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
                                                            handleBirthDateChange(
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
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="বয়স"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>বয়স/মাস</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="পশুর বয়স/মাস লিখুন"
                                                type="text"
                                                {...field}
                                                readOnly
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
                                name="স্টল_নম্বর"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>স্টল নাং</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="স্টল নাং লিখুন"
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ওজন"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>ওজন/কেজি</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="পশুর ওজন/কেজি লিখুন"
                                                type="number"
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
                                data={genderOptions}
                                form={form}
                                label="গবাদিপশুর লিঙ্গ"
                                name="লিঙ্গ"
                                placeholder="গবাদিপশুর লিঙ্গ নির্বাচন করুন"
                            />

                            <SelectOption
                                data={fatteningStatusOptions}
                                form={form}
                                name="মোটাতাজা_করন_স্ট্যাটাস"
                                label="মোটাতাজা করন স্ট্যাটাস"
                                placeholder="মোটাতাজা করন স্ট্যাটাস নির্বাচন করুন"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <FormField
                                control={form.control}
                                name="জাত"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>জাত (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="জাত লিখুন"
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
                                name="বাবার_নাম"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            বাবার নাম (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="বাবার নাম লিখুন"
                                                type="text"
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
                                name="বাবার_আইডি"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            বাবার আইডি (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="বাবার আইডি লিখুন"
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
                                name="মায়ের_নাম"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            মার নাম (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="মার নাম লিখুন"
                                                type="text"
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
                                name="মায়ের_আইডি"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            মার আইডি (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="মার আইডি লিখুন"
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
                                name="পার্সেন্টেজ"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            পার্সেন্টেজে (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="পার্সেন্টেজে লিখুন লিখুন"
                                                type="text"
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
                                data={cattleTypeOptions}
                                form={form}
                                name="গবাদিপশুর_ধরন"
                                label="গবাদিপশুর ধরন"
                                placeholder="গবাদিপশুর ধরন নির্বাচন করুন"
                            />

                            <SelectOption
                                data={categoryOptions}
                                form={form}
                                name="গবাদিপশুর_ক্যাটাগরি"
                                label="গবাদিপশুর ক্যাটাগরি"
                                placeholder="গবাদিপশুর ক্যাটাগরি নির্বাচন করুন"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <SelectOption
                                data={deathStatusOptions}
                                form={form}
                                name="অবস্থা"
                                label="মৃত অবস্থা"
                                placeholder="মৃত অবস্থা নির্বাচন করুন"
                            />

                            <SelectOption
                                data={transferStatusOptions}
                                form={form}
                                name="অবস্থান"
                                label="স্থানান্তর/বিক্রয়"
                                placeholder="স্থানান্তর/বিক্রয় নির্বাচন করুন"
                            />
                        </div>

                        <div>
                            <FormField
                                control={form.control}
                                name="বিবরন"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>বিবরন</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="পশুর বিবরন লিখুন"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end items-center gap-2">
                            <Button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                সংরক্ষণ করুন
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
