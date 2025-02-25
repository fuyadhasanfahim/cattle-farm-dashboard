'use client';

import { IMilkProduction } from '@/types/milk.production.interface';
import { useState } from 'react';
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

const cattleTypeOptions = [
    { value: 'গরু', label: 'গরু' },
    { value: 'মহিষ', label: 'মহিষ' },
    { value: 'ছাগল', label: 'ছাগল' },
];

export default function AddMilkProduction() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<IMilkProduction>({
        defaultValues: {
            দুধ_সংগ্রহের_তারিখ: new Date(),
            গবাদি_পশুর_ধরণ: '',
            সেশন: undefined,
        },
    });

    const onSubmit = async (data: IMilkProduction) => {
        setIsLoading(true);

        console.log(data);

        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-6">
                    <FormField
                        control={form.control}
                        name="দুধ_সংগ্রহের_তারিখ"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>দুধ সংগ্রহের তারিখ</FormLabel>
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
                                                    format(field.value, 'PPP')
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
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SelectOption
                        data={cattleTypeOptions}
                        form={form}
                        name="গবাদি_পশুর_ধরণ"
                        label="গবাদি পশুর ধরণ"
                        placeholder="গবাদি পশুর ধরণ নির্বাচন করুন"
                    />

                    <FormField
                        control={form.control}
                        name="সেশন"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>সেশন</FormLabel>
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
                                                    format(field.value, 'PPP')
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
                                                date < new Date('1900-01-01')
                                            }
                                            required
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <button type="submit" className="btn-primary">
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Save className="size-5" />
                                <span>সংরক্ষন করুন</span>
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </Form>
    );
}
