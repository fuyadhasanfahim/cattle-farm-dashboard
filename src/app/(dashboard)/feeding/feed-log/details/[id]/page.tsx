'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import MyCalender from '@/components/shared/MyCalender';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash, Save } from 'lucide-react';
import { IFeedingLog } from '@/types/feeding.interface';
import { ICattle } from '@/types/cattle.interface';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const feedSchema = z.object({
    cattleId: z.string().optional(),
    feedType: z.string().min(1, 'Feed type is required'),
    feedDate: z.date(),
    feedAmount: z.number().min(1, 'Feed amount must be at least 1'),
});

export default function FeedLogDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isCattleIdLoading, setIsCattleIdLoading] = useState<boolean>(false);
    const [cattleId, setCattleId] = useState<ICattle[] | []>([]);

    const form = useForm({
        resolver: zodResolver(feedSchema),
        defaultValues: {
            cattleId: '',
            feedType: '',
            feedDate: new Date(),
            feedAmount: 0,
        },
    });

    useEffect(() => {
        const fetchCattleIds = async () => {
            setIsCattleIdLoading(true);
            try {
                const response = await fetch(`/api/cattle/get-all-tag-id`);
                if (!response.ok) throw new Error('Failed to fetch cattle IDs');

                const result = await response.json();
                setCattleId(result.data);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsCattleIdLoading(false);
            }
        };
        fetchCattleIds();
    }, []);

    useEffect(() => {
        const fetchFeedLog = async () => {
            if (!id || cattleId.length === 0) return;

            setIsLoading(true);
            try {
                const response = await fetch(
                    `/api/feeding/logs/get-log?id=${id}`
                );
                if (!response.ok) throw new Error('Failed to fetch feed log');

                const { data } = await response.json();

                form.reset({
                    cattleId: data.cattleId,
                    feedType: data.feedType,
                    feedDate: new Date(data.feedDate),
                    feedAmount: data.feedAmount,
                });
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedLog();
    }, [form, id, cattleId]);

    const onUpdate = async (values: IFeedingLog) => {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/feeding/logs/update-log?id=${id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) throw new Error('Failed to update feed log');

            toast.success('Feed log updated successfully');

            router.back();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this feed log?'))
            return;

        setIsDeleting(true);
        try {
            const response = await fetch(
                `/api/feeding/logs/delete-log?id=${id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) throw new Error('Failed to delete feed log');

            toast.success('Feed log deleted successfully');
            router.back();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Edit Feed Log</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onUpdate)}
                        className="space-y-4"
                    >
                        <MyCalender
                            form={form}
                            label="Select Feed Date *"
                            name="feedDate"
                        />

                        <FormField
                            control={form.control}
                            name="cattleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select ID (Optional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        required
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isCattleIdLoading
                                                            ? 'Loading cattle IDs...'
                                                            : 'Select Cattle ID'
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cattleId.map(
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
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="feedType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feed Type *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        required
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Feed Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[
                                                {
                                                    value: 'Dung',
                                                    label: 'Dung',
                                                },
                                                {
                                                    value: 'Grass',
                                                    label: 'Grass',
                                                },
                                                {
                                                    value: 'Feed',
                                                    label: 'Feed',
                                                },
                                            ].map(({ value, label }, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={value}
                                                >
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="feedAmount">
                                <span className="block text-sm font-medium text-gray-700">
                                    Quantity (kg) *
                                </span>
                            </Label>
                            <Input
                                type="number"
                                {...form.register('feedAmount', {
                                    valueAsNumber: true,
                                })}
                                placeholder="Enter quantity"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            />
                            {form.formState.errors.feedAmount && (
                                <p className="text-red-500 text-sm mt-1">
                                    {form.formState.errors.feedAmount.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => router.back()}
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2" />
                                Back
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                <Save className="mr-2" />
                                {loading ? 'Updating...' : 'Update'}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onDelete}
                                disabled={isDeleting}
                                className="w-full"
                            >
                                <Trash className="mr-2" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
