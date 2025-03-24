'use client';

import { Plus, Droplet, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ISales } from '@/types/sales.interface';

export default function MilkDashboardHero() {
    const [loading, setLoading] = useState(true);
    const [milkLoading, setMilkLoading] = useState(true);
    const [todaysMilk, setTodaysMilk] = useState(0);
    const [totalFullAmount, setTotalFullAmount] = useState(0);
    const [totalDueAmount, setTotalDueAmount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([fetchSalesData(), fetchTodaysMilk()]);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'An unexpected error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchSalesData = async () => {
        const response = await fetch(`/api/sales/get-sales`);
        const result = await response.json();

        if (result.success) {
            const fullAmount = result.data.reduce(
                (sum: number, sale: ISales) => sum + sale.totalPrice,
                0
            );
            const dueAmount = result.data.reduce(
                (sum: number, sale: ISales) => sum + sale.dueAmount,
                0
            );

            setTotalFullAmount(fullAmount);
            setTotalDueAmount(dueAmount);
        } else {
            toast.error(result.message || 'Failed to fetch sales data');
        }
    };

    const fetchTodaysMilk = async () => {
        setMilkLoading(true);
        try {
            const todayDate = new Date().toISOString();
            const response = await fetch(
                `/api/milk/get-milk-amount-by-date?date=${todayDate}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result);

            setTodaysMilk(result?.data || 0);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setMilkLoading(false);
        }
    };

    return (
        <section className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    Milk Dashboard
                </h1>
                <Button asChild>
                    <Link href="/sales/add-sales">
                        <Plus className="mr-2 h-4 w-4" />
                        Milk Collection
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Today's Milk"
                    value={todaysMilk}
                    isLoading={milkLoading}
                    icon={<Droplet className="h-5 w-5" />}
                    gradient="from-blue-50 to-blue-100"
                    textColor="text-blue-800"
                    valueColor="text-blue-900"
                    unit="Liters"
                    format={(val) => val.toFixed(2)}
                />

                <StatCard
                    title="Full Amount"
                    value={totalFullAmount}
                    isLoading={loading}
                    icon={<DollarSign className="h-5 w-5" />}
                    gradient="from-green-50 to-green-100"
                    textColor="text-green-800"
                    valueColor="text-green-900"
                    unit="Taka"
                    format={(val) => val.toLocaleString()}
                />

                <StatCard
                    title="Due Amount"
                    value={totalDueAmount}
                    isLoading={loading}
                    icon={<AlertCircle className="h-5 w-5" />}
                    gradient="from-red-50 to-red-100"
                    textColor="text-red-800"
                    valueColor="text-red-900"
                    unit="Taka"
                    format={(val) => val.toLocaleString()}
                />
            </div>
        </section>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    isLoading: boolean;
    icon: React.ReactElement;
    gradient: string;
    textColor: string;
    valueColor: string;
    unit: string;
    format: (value: number) => string;
}

function StatCard({
    title,
    value,
    isLoading,
    icon,
    gradient,
    textColor,
    valueColor,
    unit,
    format,
}: StatCardProps) {
    return (
        <Card className="overflow-hidden shadow-md">
            <CardHeader className={`bg-gradient-to-r ${gradient} pb-2`}>
                <CardTitle
                    className={`flex items-center gap-2 text-lg font-medium ${textColor}`}
                >
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                ) : (
                    <div>
                        <p className={`text-3xl font-bold ${valueColor}`}>
                            {format(value)}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                            {unit}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
