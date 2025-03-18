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
import { ArrowLeft, CalendarIcon, Loader2, Save } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import SelectOption from '../shared/Select';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { milkProductionValidationSchema } from '@/validator/milk.production.validation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICattle } from '@/types/cattle.interface';
import { IMilkProduction } from '@/types/milk.production.interface';

const milkingOptions = [
    {
        value: 'Morning',
        label: 'Morning',
    },
    {
        value: 'Afternoon',
        label: 'Afternoon',
    },
    {
        value: 'Evening',
        label: 'Evening',
    },
    {
        value: 'Night',
        label: 'Night',
    },
];

export default function AddMilkProduction() {
    const [isLoading, setIsLoading] = useState(false);
    const [cattles, setCattles] = useState<ICattle[] | []>([]);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(milkProductionValidationSchema),
        defaultValues: {
            milkCollectionDate: new Date(),
            cattleTagId: '',
            totalMilkQuantity: '',
            saleableMilkQuantity: '',
            milkForConsumption: '',
            fatPercentage: '',
            time: '',
        },
    });

    const totalMilkAmount = form.watch('totalMilkQuantity');
    const saleableMilkAmount = form.watch('saleableMilkQuantity');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/cattle/get-all-tag-id');
                if (!response.ok)
                    throw new Error('Failed to fetch cattle data');

                const { data } = await response.json();
                setCattles(data);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Failed to fetch cattle data'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const totalMilk = Number(totalMilkAmount) || 0;
        const saleableMilk = Number(saleableMilkAmount) || 0;
        const milkForHome = totalMilk - saleableMilk;

        form.setValue('milkForConsumption', milkForHome.toString());
    }, [totalMilkAmount, saleableMilkAmount, form]);

    const onSubmit = async (data: IMilkProduction) => {
        setIsLoading(true);

        try {
            const response = await fetch(
                '/api/milk-production/add-milk-production',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success('Milk production data saved successfully.');
                form.reset();
                router.push('/milk-production');
            } else {
                toast.error(
                    result.message || 'Failed to save milk production data.'
                );
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-6 items-center">
                    <FormField
                        control={form.control}
                        name="milkCollectionDate"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Milk Collection Date *</FormLabel>
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
                                                    <span>Select Date</span>
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
                        name="time"
                        label="Select Time *"
                        placeholder="eg: Morning"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                    <SelectOption
                        data={
                            cattles.length > 0
                                ? cattles.map((c) => ({
                                      value: c.tagId,
                                      label: c.tagId,
                                  }))
                                : [{ value: 'N/A', label: 'N/A' }]
                        }
                        form={form}
                        name="cattleTagId"
                        label="Cattle tag ID *"
                        placeholder="eg: 1200"
                        required
                    />

                    <FormField
                        control={form.control}
                        name="totalMilkQuantity"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Total Milk Quantity (Liter) *
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 200"
                                        onChange={(e) => {
                                            const value = e.target.value || 0;
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

                <div className="grid grid-cols-2 gap-6 items-center">
                    <FormField
                        control={form.control}
                        name="saleableMilkQuantity"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    saleable Milk Quantity (Liter) *
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 180"
                                        max={totalMilkAmount || 0}
                                        onChange={(e) => {
                                            const value = e.target.value || 0;
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
                        name="milkForConsumption"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>
                                    Milk For Consumption (Liter) *
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 20"
                                        readOnly
                                        className="bg-gray-50"
                                        value={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                    <FormField
                        control={form.control}
                        name="fatPercentage"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Fat Percentage (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eg: 50"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        onChange={(e) => {
                                            let value = e.target.value || 0;
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

                    <div></div>
                </div>

                <div className="flex items-center justify-center gap-6">
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
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <Save className="size-5" />
                        )}
                        <span>Save</span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}
