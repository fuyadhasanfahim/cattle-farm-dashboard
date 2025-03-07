'use client';

export const dynamic = 'force-dynamic';

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
import { IFeeding } from '@/types/feeding.interface';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddFeeding: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<IFeeding>({
        defaultValues: {
            খাদ্যের_ধরণ: '',
            খাদ্যের_পরিমাণ: 0,
            তারিখ: new Date(),
            প্রতি_কেজির_দাম: 0,
            মোট_দাম: 0,
            পেমেন্টের_ধরণ: '',
        },
    });

    const খাদ্যের_পরিমাণ = form.watch('খাদ্যের_পরিমাণ');
    const প্রতি_কেজির_দাম = form.watch('প্রতি_কেজির_দাম');

    React.useEffect(() => {
        const মোট_দাম = খাদ্যের_পরিমাণ * প্রতি_কেজির_দাম;
        form.setValue('মোট_দাম', মোট_দাম);
    }, [খাদ্যের_পরিমাণ, প্রতি_কেজির_দাম, form]);

    const onSubmit = async (data: IFeeding) => {
        try {
            setIsLoading(false);

            const response = await fetch(`/api/feeding/add-feeding`, {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error('Failed to add feeding data');
            } else {
                toast.success('Successfully added the data.');
                form.reset();

                router.push('/feeding');
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to add feeding data');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Feeding</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 items-center gap-6">
                            <SelectOption
                                data={[
                                    {
                                        label: 'দানাদার',
                                        value: 'দানাদার',
                                    },
                                    {
                                        label: 'খর',
                                        value: 'খর',
                                    },
                                    {
                                        label: 'ঘাস',
                                        value: 'ঘাস',
                                    },
                                    {
                                        label: 'সাইলেজ',
                                        value: 'সাইলেজ',
                                    },
                                ]}
                                form={form}
                                label="খাদ্যর ধরণ"
                                name="খাদ্যের_ধরণ"
                                placeholder="খাদ্যের ধরণ সিলেক্ট করেন"
                            />

                            <FormField
                                control={form.control}
                                name="খাদ্যের_পরিমাণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>খাদ্যের পরিমাণ</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="প্রতি_কেজির_দাম"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>প্রতি কেজির দাম</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="মোট_দাম"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>মোট দাম</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 items-center gap-6">
                            <SelectOption
                                data={[
                                    {
                                        label: 'নগদ',
                                        value: 'নগদ',
                                    },
                                    {
                                        label: 'বাকি',
                                        value: 'বাকি',
                                    },
                                ]}
                                form={form}
                                label="পেমেন্টের ধরণ"
                                name="পেমেন্টের_ধরণ"
                                placeholder="পেমেন্টের ধরণ সিলেক্ট করেন"
                            />
                        </div>

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting' : 'Submit'}
                        </button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default AddFeeding;
