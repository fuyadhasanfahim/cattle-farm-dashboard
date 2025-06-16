'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import {
    ArrowLeft,
    CalendarIcon,
    Loader2,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { Calendar } from '../ui/calendar';
import SelectOption from '../shared/Select';
import toast from 'react-hot-toast';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { ICattle } from '@/types/cattle.interface';

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

type MilkProductionEntry = {
    cattleTagId: string;
    milkQuantity: string;
    fatPercentage: string;
};

type MilkProductionFormData = {
    milkCollectionDate: Date;
    time: string;
    entries: MilkProductionEntry[];
};

export default function AddMilkProduction() {
    const [isLoading, setIsLoading] = useState(false);
    const [cattles, setCattles] = useState<ICattle[] | []>([]);
    const router = useRouter();

    const form = useForm<MilkProductionFormData>({
        defaultValues: {
            milkCollectionDate: new Date(),
            time: '',
            entries: [
                {
                    cattleTagId: '',
                    milkQuantity: '',
                    fatPercentage: '',
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'entries',
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/cattle/get-all-tag-id');
                if (!response.ok) toast.error('Failed to fetch cattle data');

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

    const onSubmit = async (data: MilkProductionFormData) => {
        setIsLoading(true);

        try {
            const payload = data.entries.map((entry) => ({
                milkCollectionDate: data.milkCollectionDate,
                time: data.time,
                cattleTagId: entry.cattleTagId,
                milkQuantity: entry.milkQuantity,
                fatPercentage: entry.fatPercentage,
            }));

            const response = await fetch(
                '/api/milk-production/add-milk-production',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success('Milk production data saved successfully.');
                form.reset({
                    milkCollectionDate: new Date(),
                    time: '',
                    entries: [
                        {
                            cattleTagId: '',
                            milkQuantity: '',
                            fatPercentage: '',
                        },
                    ],
                });
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

    const addAnotherEntry = () => {
        append({
            cattleTagId: '',
            milkQuantity: '',
            fatPercentage: '',
        });
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

                <div className="space-y-6">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-7 gap-4 items-end relative"
                        >
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
                                name={`entries.${index}.cattleTagId`}
                                label="Cattle tag ID *"
                                placeholder="eg: 1200"
                                className="col-span-2"
                                required
                            />

                            <FormField
                                control={form.control}
                                name={`entries.${index}.milkQuantity`}
                                render={({ field }) => (
                                    <FormItem className="w-full col-span-2">
                                        <FormLabel>
                                            Total Milk Quantity (Liter) *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="eg: 200"
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
                                name={`entries.${index}.fatPercentage`}
                                render={({ field }) => (
                                    <FormItem className="w-full col-span-2">
                                        <FormLabel>
                                            Fat Percentage (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="eg: 50"
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

                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="col-span-1"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="size-5" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        size={'lg'}
                        variant={'secondary'}
                        type="button"
                        onClick={addAnotherEntry}
                    >
                        <Plus className="size-5" />
                        <span>Another</span>
                    </Button>
                </div>

                <div className="grid grid-cols-2 items-center gap-6">
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
