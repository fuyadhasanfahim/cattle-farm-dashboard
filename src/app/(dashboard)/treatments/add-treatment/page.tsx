'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import MyCalender from '@/components/shared/MyCalender';

interface CattleTag {
    tagId: string;
}

const formSchema = z.object({
    treatmentType: z.enum(['Deworming', 'Vaccination', 'General'], {
        required_error: 'Please select a treatment type',
    }),
    medicineName: z.string().min(1, 'Medicine name is required'),
    medicineAmount: z.string().optional(),
    medicineReason: z.string().optional(),
    vaccinationInterval: z
        .union([z.literal(3), z.literal(6), z.literal(9), z.literal(12)])
        .optional(),
    treatmentDate: z.date().default(new Date()),
    cattleEntries: z
        .array(
            z.object({
                cattleId: z.string().min(1, 'Cattle ID is required'),
            })
        )
        .nonempty({
            message: 'At least one cattle must be selected',
        }),
});

export default function AddTreatment() {
    const [treatmentType, setTreatmentType] = useState('');
    const [availableCattle, setAvailableCattle] = useState<CattleTag[]>([]);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            treatmentType: undefined,
            medicineName: '',
            medicineAmount: '',
            medicineReason: '',
            vaccinationInterval: undefined,
            treatmentDate: new Date(),
            cattleEntries: [{ cattleId: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'cattleEntries',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/cattle/get-all-tag-id`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cattle data');
                }
                const result = await response.json();
                setAvailableCattle(result.data);
            } catch (error) {
                toast.error((error as Error).message);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Prepare the data to send to the backend
            const payload = values.cattleEntries.map((entry) => ({
                cattleId: entry.cattleId,
                treatmentType: values.treatmentType,
                medicineName: values.medicineName,
                medicineAmount: values.medicineAmount,
                medicineReason: values.medicineReason,
                vaccinationInterval: values.vaccinationInterval,
                treatmentDate: values.treatmentDate,
            }));

            console.log(payload);

            if (values.treatmentType === 'Deworming') {
                toast((t) => (
                    <span>
                        <b>Reminder:</b> Deworming due in 3 months!
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="btn-primary"
                        >
                            Dismiss
                        </button>
                    </span>
                ));
            }

            if (
                values.treatmentType === 'Vaccination' &&
                values.vaccinationInterval
            ) {
                toast((t) => (
                    <span>
                        <b>Reminder:</b> Vaccination due in{' '}
                        {values.vaccinationInterval} months!
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="btn-primary"
                        >
                            Dismiss
                        </button>
                    </span>
                ));
            }

            const response = await fetch(`/api/treatments/add-treatment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Treatment records added successfully!');
                form.reset({
                    treatmentType: undefined,
                    medicineName: '',
                    medicineAmount: '',
                    medicineReason: '',
                    vaccinationInterval: undefined,
                    treatmentDate: new Date(),
                    cattleEntries: [{ cattleId: '' }],
                });
                router.push('/treatments');
            } else {
                toast.error('Failed to add treatment records');
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    const addAnotherCattle = () => {
        append({ cattleId: '' });
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-xl">Cattle Treatment Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <MyCalender
                            form={form}
                            label="Select Treatment Date"
                            name="treatmentDate"
                            placeholder="Select Date"
                        />

                        <FormField
                            control={form.control}
                            name="treatmentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Treatment Type</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setTreatmentType(value);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select treatment type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Deworming">
                                                Deworming
                                            </SelectItem>
                                            <SelectItem value="Vaccination">
                                                Vaccination
                                            </SelectItem>
                                            <SelectItem value="General">
                                                General
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="medicineName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Medicine/Vaccine Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter medicine or vaccine name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {treatmentType === 'Deworming' && (
                            <FormField
                                control={form.control}
                                name="medicineAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Medicine/Vaccine Amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter medicine or vaccine amount"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {treatmentType === 'Vaccination' && (
                            <FormField
                                control={form.control}
                                name="vaccinationInterval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Select Reminder Interval
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                            defaultValue={
                                                field.value
                                                    ? String(field.value)
                                                    : undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select interval" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="3">
                                                    3 Months
                                                </SelectItem>
                                                <SelectItem value="6">
                                                    6 Months
                                                </SelectItem>
                                                <SelectItem value="9">
                                                    9 Months
                                                </SelectItem>
                                                <SelectItem value="12">
                                                    12 Months
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {treatmentType === 'General' && (
                            <FormField
                                control={form.control}
                                name="medicineReason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medicine Reason</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter reason for the medicine"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-end gap-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`cattleEntries.${index}.cattleId`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>
                                                    {index === 0
                                                        ? 'Cattle ID'
                                                        : ''}
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Cattle ID" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {availableCattle?.map(
                                                            ({ tagId }) => (
                                                                <SelectItem
                                                                    key={tagId}
                                                                    value={
                                                                        tagId ||
                                                                        'N/A'
                                                                    }
                                                                >
                                                                    {tagId ||
                                                                        'N/A'}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {index > 0 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={addAnotherCattle}
                            className="w-full"
                        >
                            <Plus className="size-5 mr-2" />
                            Add Another Cattle
                        </Button>

                        <div className="flex items-center justify-between gap-6">
                            <Button
                                onClick={() => router.back()}
                                className="w-full"
                                type="button"
                                variant={'outline'}
                            >
                                <ArrowLeft className="size-5" />
                                <span>Back</span>
                            </Button>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? 'Submitting...'
                                    : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
