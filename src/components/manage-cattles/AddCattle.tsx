'use client';

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
import { useForm } from 'react-hook-form';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import ICattleFormValues from '@/types/cattle.interface';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ToastAction } from '../ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

const genderOptions = [
    { value: 'male', label: 'পুরুষ' },
    { value: 'female', label: 'মহিলা' },
];

const cattleTypeOptions = [
    { value: 'cow', label: 'গরু' },
    { value: 'buffalo', label: 'মহিষ' },
    { value: 'goat', label: 'ছাগল' },
];

const categoryOptions = [
    { value: 'bull', label: 'ষাঁড়' },
    { value: 'dairy', label: 'দুগ্ধ' },
    { value: 'beef', label: 'মাংস' },
    { value: 'dual', label: 'দুগ্ধ ও মাংস' },
];

const deathStatusOptions = [
    { value: 'alive', label: 'জীবিত' },
    { value: 'dead', label: 'মৃত' },
];

const fatteningStatusOptions = [
    { value: 'alive', label: 'জীবিত' },
    { value: 'dead', label: 'মৃত' },
];

const transferStatusOptions = [
    { value: 'alive', label: 'জীবিত' },
    { value: 'dead', label: 'মৃত' },
];

export default function AddCattle({
    setOpen,
}: {
    setOpen: (isOpen: boolean) => void;
}) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ICattleFormValues>({
        defaultValues: {
            cattleId: '',
            registrationDate: new Date(),
            birthDate: undefined,
            age: '',
            stallNo: '',
            weight: '',
            gender: '',
            fatteningStatus: '',
            cattleType: '',
            category: '',
            transferStatus: '',
            deathStatus: '',
            description: '',
        },
    });

    const onSubmit = async (data: ICattleFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/cattle/add-cattle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            await response.json();
            toast({
                title: 'সফল!',
                description: 'গবাদি পশুর তথ্য সফলভাবে যোগ করা হয়েছে।',
            });

            setOpen(false);

            form.reset();
        } catch (error) {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'ত্রুটি!',
                description: 'ফর্ম জমা দেওয়ার সময় একটি ত্রুটি ঘটেছে।',
                action: (
                    <ToastAction altText="Try again">
                        আবার চেষ্টা করুন
                    </ToastAction>
                ),
            });
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 font-notoSansBengali px-4">
            <div className="flex items-center justify-between">
                <DialogHeader>
                    <DialogTitle>গবাদি পশুর তথ্য যোগ করুন</DialogTitle>
                </DialogHeader>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-6">
                        <FormField
                            control={form.control}
                            name="cattleId"
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
                            name="registrationDate"
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
                                                            তারিখ নির্বাচন করুন
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
                                                        field.onChange(date);
                                                    }
                                                }}
                                                disabled={(date) =>
                                                    date > new Date() ||
                                                    date <
                                                        new Date('1900-01-01')
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
                            name="birthDate"
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
                                                            তারিখ নির্বাচন করুন
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
                                                        field.onChange(date);
                                                    }
                                                }}
                                                disabled={(date) =>
                                                    date > new Date() ||
                                                    date <
                                                        new Date('1900-01-01')
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
                            name="age"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>বয়স/মাস</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="পশুর বয়স/মাস লিখুন"
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
                        <FormField
                            control={form.control}
                            name="stallNo"
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
                            name="weight"
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
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>গবাদিপশুর লিঙ্গ</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="লিঙ্গ নির্বাচন করুন" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {genderOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fatteningStatus"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>
                                        মোটাতাজা করন স্ট্যাটাস
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="নির্বাচন করুন" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {fatteningStatusOptions.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <FormField
                            control={form.control}
                            name="cattleType"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>গবাদিপশুর ধরন</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="পশুর ধরন নির্বাচন করুন" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cattleTypeOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>গবাদিপশুর ক্যাটাগরি</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoryOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <FormField
                            control={form.control}
                            name="deathStatus"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>মৃত অবস্থা</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="মৃত অবস্থা নির্বাচন করুন" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {deathStatusOptions.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="transferStatus"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>স্থানান্তর/বিক্রয়</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="স্থানান্তর/বিক্রয় নির্বাচন করুন" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {transferStatusOptions.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div>
                        <FormField
                            control={form.control}
                            name="description"
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
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            বাতিল
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#52aa46] hover:bg-[#4a9940]"
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
        </div>
    );
}
