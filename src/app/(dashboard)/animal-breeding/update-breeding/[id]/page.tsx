'use client';

import MyCalender from '@/components/shared/MyCalender';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import IBreeding from '@/types/breeding.interface';
import { ICattle } from '@/types/cattle.interface';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UpdateBreeding() {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMothersIdLoading, setMothersIdLoading] = useState<boolean>(false);
    const [mothers, setMothers] = useState<ICattle[]>([]);
    const router = useRouter();

    const form = useForm<IBreeding>({
        defaultValues: {
            selectId: 0,
            bullName: '',
            bullNumber: 0,
            bullType: '',
            semenPercentage: '',
            semenCompanyName: '',
            semenDate: undefined,
            checkForSemenSuccessResult: undefined,
            approximateBirthdate: undefined,
            checkForSemenSuccessStatus: '',
        },
    });

    useEffect(() => {
        const fetchBreedingData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `/api/breeding/get-breeding-by-id?id=${id}`
                );
                const result = await response.json();

                if (response.ok) {
                    form.reset(result?.data);
                } else {
                    toast.error('Failed to fetch breeding data');
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBreedingData();
    }, [id, form]);

    useEffect(() => {
        const fetchMothersData = async () => {
            try {
                setMothersIdLoading(true);
                const response = await fetch(`/api/cattle/get-mothers-id`);
                const result = await response.json();

                if (response.ok) {
                    setMothers(result?.data);
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setMothersIdLoading(false);
            }
        };

        fetchMothersData();
    }, []);

    const onSubmit = async (data: IBreeding) => {
        try {
            setIsSubmitting(true);
            const response = await fetch(
                `/api/breeding/update-breeding?id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, ...data }),
                }
            );

            if (!response.ok) {
                toast.error('Failed to update breeding');
            } else {
                toast.success('Breeding updated successfully. Redirecting!');
                router.push('/animal-breeding');
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <Loader2 className="size-10 animate-spin" />;
            </div>
        );
    }

    return (
        <Card className="font-inter">
            <CardHeader>
                <CardTitle className="text-3xl">Update Breeding</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="selectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select ID</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            isMothersIdLoading
                                                                ? 'Loading'
                                                                : 'Select ID'
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mothers.map(
                                                    (mothers, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={
                                                                mothers.ট্যাগ_আইডি
                                                            }
                                                        >
                                                            {mothers.ট্যাগ_আইডি}
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
                                name="bullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bull Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bull name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="bullNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bull Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bull number"
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
                                name="bullType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bull Type</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter bull type"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="semenPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Semen Percentage</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter semen percentage"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="semenCompanyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Semen Company Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter semen company name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <MyCalender
                                form={form}
                                label="Semen Date"
                                name="semenDate"
                                placeholder="Select semen date"
                            />
                            <MyCalender
                                form={form}
                                label="Check for Semen Success Result in"
                                name="checkForSemenSuccessResult"
                                placeholder="Select date"
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <MyCalender
                                form={form}
                                label="Approximate Birthdate"
                                name="approximateBirthdate"
                                placeholder="Select Approximate birthdate"
                            />

                            <FormField
                                control={form.control}
                                name="checkForSemenSuccessStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Select the Semen Success Status
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the Semen Success Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[
                                                    {
                                                        label: 'Pending for approval',
                                                        value: 'pending for approval',
                                                    },
                                                    {
                                                        label: 'Failed to Conceive',
                                                        value: 'failed for conceive',
                                                    },
                                                    {
                                                        label: 'Successfully Conceive',
                                                        value: 'successfully conceive',
                                                    },
                                                ].map(
                                                    (
                                                        { label, value },
                                                        index
                                                    ) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={value}
                                                        >
                                                            {label}
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

                        <button
                            type="submit"
                            className={cn(
                                'btn-primary',
                                isSubmitting
                                    ? 'bg-muted cursor-not-allowed'
                                    : ''
                            )}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
