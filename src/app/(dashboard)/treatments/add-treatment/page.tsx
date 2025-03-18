'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { ITreatment } from '@/types/treatment.interface';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface CattleTag {
    tagId: string;
}

const formSchema = z.object({
    cattleId: z.string().min(1, 'Cattle ID is required'),
    treatmentType: z.enum(['Deworming', 'Vaccination', 'General'], {
        required_error: 'Please select a treatment type',
    }),
    medicineName: z.string().min(1, 'Medicine name is required'),
    medicineReason: z.string().optional(),
    vaccinationInterval: z
        .union([z.literal(3), z.literal(6), z.literal(9), z.literal(12)])
        .optional(),
    treatmentDate: z.date().default(new Date()),
    dewormingCount: z.number().min(0),
    vaccinationCount: z.number().min(0),
    generalCount: z.number().min(0),
});

export default function AddTreatment() {
    const [treatmentType, setTreatmentType] = useState('');
    const [cattleId, setCattleId] = useState<CattleTag[]>([]);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cattleId: '',
            treatmentType: undefined,
            medicineName: '',
            medicineReason: '',
            vaccinationInterval: undefined,
            treatmentDate: new Date(),
            dewormingCount: 0,
            vaccinationCount: 0,
            generalCount: 0,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/cattle/get-all-tag-id`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cattle data');
                }
                const result = await response.json();
                setCattleId(result.data);
            } catch (error) {
                toast.error((error as Error).message);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (values: ITreatment) => {
        try {
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
                        <b>Reminder:</b> Vaccination due in
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
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast.success('Treatment record added successfully!');

                form.reset({
                    cattleId: '',
                    treatmentType: undefined,
                    medicineName: '',
                    medicineReason: '',
                    vaccinationInterval: undefined,
                    treatmentDate: new Date(),
                    dewormingCount: 0,
                    vaccinationCount: 0,
                    generalCount: 0,
                });

                router.push('/treatments');
            } else {
                toast.error('Failed to add treatment record');
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <Card className="max-w-lg mx-auto mt-10 p-4">
            <CardHeader>
                <CardTitle className="text-xl">Cattle Treatment Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="cattleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cattle ID</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Cattle ID" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cattleId?.map(
                                                ({ tagId }, index) => (
                                                    <SelectItem
                                                        key={index}
                                                        value={tagId}
                                                    >
                                                        {tagId}
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
