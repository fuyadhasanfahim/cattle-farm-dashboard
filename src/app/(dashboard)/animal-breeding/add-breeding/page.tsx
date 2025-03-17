'use client';

import MyCalender from '@/components/shared/MyCalender';
import SelectOption from '@/components/shared/Select';
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
import { cn } from '@/lib/utils';
import IBreeding from '@/types/breeding.interface';
import { ICattle } from '@/types/cattle.interface';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AddBreeding() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isMothersIdLoading, setMothersIdLoading] = useState<boolean>(false);
    const [mothers, setMothers] = useState<ICattle[]>([]);
    const router = useRouter();

    const form = useForm<IBreeding>({
        defaultValues: {
            selectId: 0,
            bullName: '',
            bullNumber: '',
            bullType: '',
            semenPercentage: '',
            semenCompanyName: '',
            semenDate: new Date(),
            checkForSemenSuccessResult: new Date(
                new Date().setDate(new Date().getDate() + 90)
            ),
            approximateBirthdate: new Date(
                new Date().setDate(new Date().getDate() + 280)
            ),
        },
    });

    const { watch, setValue } = form;
    const semenDate = watch('semenDate');

    useEffect(() => {
        if (semenDate) {
            setValue(
                'checkForSemenSuccessResult',
                new Date(
                    new Date(semenDate).setDate(
                        new Date(semenDate).getDate() + 90
                    )
                )
            );
            setValue(
                'approximateBirthdate',
                new Date(
                    new Date(semenDate).setDate(
                        new Date(semenDate).getDate() + 280
                    )
                )
            );
        }
    }, [semenDate, setValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setMothersIdLoading(true);

                const response = await fetch(`/api/cattle/get-mothers-id`);
                const result = await response.json();

                if (response.ok) {
                    setMothers(result?.data);
                }
            } catch (error) {
                console.log(error);
                toast.error('Something went wrong!');
            } finally {
                setMothersIdLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: IBreeding) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/breeding/add-breeding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Failed to add breeding');
            } else {
                toast.success('Breeding added successfully. Redirecting!');
                form.reset();
                router.push('/animal-breeding');
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle className="text-3xl">Add Breeding</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-2 items-center gap-6">
                            <SelectOption
                                data={mothers.map((mother) => ({
                                    value: mother.tagId,
                                    label: mother.tagId,
                                }))}
                                form={form}
                                label="Select ID"
                                name="selectId"
                                placeholder={
                                    isMothersIdLoading
                                        ? 'Loading...'
                                        : 'Select ID'
                                }
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
                                placeholder="Select birthdate"
                            />
                        </div>

                        <div>
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
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
