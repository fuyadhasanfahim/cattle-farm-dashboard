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
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import MyCalender from '@/components/shared/MyCalender';

const formSchema = z.object({
    cattleId: z.string().min(1, 'Cattle ID is required'),
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
    dewormingCount: z.number().min(0).default(0),
    vaccinationCount: z.number().min(0).default(0),
    generalCount: z.number().min(0).default(0),
});

interface CattleTag {
    tagId: string;
}

export default function UpdateTreatment() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isIdLoading, setIsIdLoading] = useState<boolean>(false);
    const [data, setData] = useState<ITreatment | null>(null);
    const [treatmentType, setTreatmentType] = useState('');
    const [cattleId, setCattleId] = useState<CattleTag[]>([]);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cattleId: '',
            treatmentType: undefined,
            medicineAmount: '',
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
                setIsIdLoading(true);

                const response = await fetch(`/api/cattle/get-all-tag-id`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cattle data');
                }
                const result = await response.json();
                setCattleId(result.data);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsIdLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/treatments/get-treatment-by-id?id=${id}`
                );

                const { data } = await response.json();

                const {
                    cattleId,
                    treatmentType,
                    medicineAmount,
                    medicineName,
                    medicineReason,
                    vaccinationInterval,
                    treatmentDate,
                    dewormingCount,
                    vaccinationCount,
                    generalCount,
                } = data;

                if (response.ok) {
                    form.reset({
                        cattleId: cattleId,
                        treatmentType: treatmentType,
                        medicineAmount: medicineAmount,
                        medicineName: medicineName,
                        medicineReason: medicineReason,
                        vaccinationInterval: vaccinationInterval,
                        treatmentDate: new Date(treatmentDate),
                        dewormingCount: dewormingCount,
                        vaccinationCount: vaccinationCount,
                        generalCount: generalCount,
                    });

                    setData(data);
                    setTreatmentType(treatmentType);
                } else {
                    toast.error('Something went wrong!');
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [form, id]);

    const onSubmit = async (values: ITreatment) => {
        try {
            setIsLoading(true);

            const payload: {
                id: string | string[];
                cattleId: string;
                treatmentType: 'Deworming' | 'Vaccination' | 'General';
                medicineName: string;
                medicineReason: string;
                treatmentDate: Date;
                vaccinationInterval?: number;
                vaccinationCount?: number;
                dewormingCount?: number;
                generalCount?: number;
            } = {
                id,
                cattleId: values.cattleId,
                treatmentType: values?.treatmentType,
                medicineName: values.medicineName,
                medicineReason: values.medicineReason as string,
                treatmentDate: values.treatmentDate,
            };

            if (values.treatmentType === 'Vaccination') {
                payload.vaccinationInterval = values.vaccinationInterval;
                payload.vaccinationCount = values.vaccinationCount;
            } else if (values.treatmentType === 'Deworming') {
                payload.dewormingCount = values.dewormingCount;
            } else if (values.treatmentType === 'General') {
                payload.generalCount = values.generalCount;
            }

            const response = await fetch(
                `/api/treatments/update-treatment?id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success('Treatment updated successfully!');

                router.push('/treatments');
            } else {
                toast.error(result.message || 'Failed to update treatment');
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!isLoading && !data) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <h3 className="text-xl font-semibold">
                    No treatment record found
                </h3>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>
            </div>
        );
    }

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
                        <MyCalender
                            form={form}
                            label="Select Treatment Date"
                            name="treatmentDate"
                            placeholder="Select Date"
                        />

                        <FormField
                            control={form.control}
                            name="cattleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cattle ID</FormLabel>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(value)
                                        }
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isIdLoading
                                                            ? 'Loading...'
                                                            : 'Select Cattle ID'
                                                    }
                                                />
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
                                        value={field.value}
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
                                            value={
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

                        {treatmentType === 'Deworming' && (
                            <FormField
                                control={form.control}
                                name="dewormingCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deworming Count</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter deworming count"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {treatmentType === 'General' && (
                            <FormField
                                control={form.control}
                                name="generalCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>General Count</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter general treatment count"
                                                {...field}
                                            />
                                        </FormControl>
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
                                onClick={() => window.history.back()}
                                className="w-full"
                                type="button"
                                variant="outline"
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
