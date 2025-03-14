'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { IFeedingLog, IFeedInventory } from '@/types/feeding.interface';
import MyCalender from '@/components/shared/MyCalender';
import { Form } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import SelectOption from '@/components/shared/Select';
import { ICattle } from '@/types/cattle.interface';

const feedSchema = z.object({
    cattleId: z.string().optional(),
    feedType: z.string().min(1, 'Feed type is required'),
    feedDate: z.date(),
    feedAmount: z.number().min(1, 'Feed amount must be at least 1'),
});

export default function AddFeedLogForm() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [isCattleIdLoading, setIsCattleIdLoading] = useState<boolean>(false);
    const [cattleId, setCattleId] = useState<ICattle[] | []>([]);
    const [isInventoryLoading, setIsInventoryLoading] =
        useState<boolean>(false);
    const [inventoryData, setInventoryData] = useState<IFeedInventory[] | []>(
        []
    );

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
        const fetchData = async () => {
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
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsInventoryLoading(true);

                const response = await fetch(
                    `/api/feeding/inventories/get-inventory`
                );

                const result = await response.json();

                if (response.ok) {
                    setInventoryData(result.inventory);
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsInventoryLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: IFeedingLog) => {
        const availableStock = inventoryData.reduce(
            (acc, data) => acc + data.totalStock,
            0
        );

        if (data.feedAmount > availableStock) {
            toast.error(
                `Not enough stock available. Max: ${availableStock} kg`
            );
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/feeding/logs/add-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            console.log(response);

            if (response.ok) {
                toast.success('Feed added successfully!');
                form.reset();
                router.back();
            } else {
                toast.error('Failed to add feed.');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Add Feed Log</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <MyCalender
                            form={form}
                            label="Select Feed Date *"
                            name="feedDate"
                        />

                        <SelectOption
                            data={
                                cattleId &&
                                cattleId.map(({ ট্যাগ_আইডি }) => ({
                                    value: ট্যাগ_আইডি,
                                    label: ট্যাগ_আইডি,
                                }))
                            }
                            form={form}
                            label="Select ID (Optional)"
                            name="cattleId"
                            placeholder={
                                isCattleIdLoading
                                    ? 'Loading id'
                                    : 'Select Cattle ID'
                            }
                            required
                        />

                        <SelectOption
                            data={[
                                {
                                    value: 'Dung',
                                    label: 'Dung',
                                },
                                {
                                    value: 'Grass',
                                    label: 'Grass',
                                },
                                {
                                    value: 'Grain Feed',
                                    label: 'Grain Feed',
                                },
                            ]}
                            form={form}
                            label="Feed Type *"
                            name="feedType"
                            placeholder="Select Feed Type"
                            required
                        />

                        <div className="space-y-2">
                            <Label htmlFor="quantityPurchased">
                                <span className="block text-sm font-medium text-gray-700">
                                    Quantity (kg) *
                                </span>
                                <span className="block text-xs text-gray-500">
                                    Available Stock:{' '}
                                    {isInventoryLoading
                                        ? 'Loading...'
                                        : inventoryData[0]?.totalStock ?? 'N/A'}
                                </span>
                            </Label>
                            <Input
                                type="number"
                                {...form.register('feedAmount', {
                                    valueAsNumber: true,
                                    validate: (value) =>
                                        value <=
                                            inventoryData.reduce(
                                                (acc, item) =>
                                                    acc + item.totalStock,
                                                0
                                            ) || 'Not enough stock available.',
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

                        <div className="flex items-center gap-6">
                            <Button
                                type="button"
                                variant={'outline'}
                                disabled={loading}
                                className="w-full"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft />
                                Back
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Adding...' : 'Add Feed'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
