'use client';

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
import { IFeeding } from '@/types/feeding.interface';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UpdateFeeding() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { id } = useParams();
    const router = useRouter();

    const form = useForm<IFeeding>();

    const খাদ্যের_পরিমাণ = form.watch('খাদ্যের_পরিমাণ');
    const প্রতি_কেজির_দাম = form.watch('প্রতি_কেজির_দাম');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/feeding/get-feeding?id=${id}`
                );

                const result = await response.json();

                if (result?.data) {
                    form.reset(result.data);
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, form]);

    useEffect(() => {
        const মোট_দাম = খাদ্যের_পরিমাণ * প্রতি_কেজির_দাম;
        form.setValue('মোট_দাম', মোট_দাম);
    }, [খাদ্যের_পরিমাণ, প্রতি_কেজির_দাম, form]);

    const onSubmit = async (data: IFeeding) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `/api/feeding/update-feeding?id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                toast.error('Failed to update feeding data');
            } else {
                toast.success('Successfully updated the data.');
                form.reset();

                router.push('/feeding');
            }
        } catch (error) {
            toast.error(
                (error as Error).message || 'Failed to update feeding data'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-inter">
                    Add Feeding
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 font-notoSansBengali"
                    >
                        <div className="grid grid-cols-2 items-center gap-6">
                            <FormField
                                control={form.control}
                                name="খাদ্যের_ধরণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>খাদ্যের ধরণ</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field?.value}
                                                onValueChange={field?.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="খাদ্যের ধরণ সিলেক্ট করুন" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="দানাদার">
                                                        দানাদার
                                                    </SelectItem>
                                                    <SelectItem value="খর">
                                                        খর
                                                    </SelectItem>
                                                    <SelectItem value="ঘাস">
                                                        ঘাস
                                                    </SelectItem>
                                                    <SelectItem value="সাইলেজ">
                                                        সাইলেজ
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
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
                            <FormField
                                control={form.control}
                                name="পেমেন্টের_ধরণ"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>পেমেন্টের ধরণ</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field?.value}
                                                onValueChange={field?.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="পেমেন্টের ধরণ সিলেক্ট করেন" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="নগদ">
                                                        নগদ
                                                    </SelectItem>
                                                    <SelectItem value="বাকি">
                                                        বাকি
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
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
}
