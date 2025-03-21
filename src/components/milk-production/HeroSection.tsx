'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Milk, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    const [isMilkLoading, setIsMilkLoading] = useState(false);
    const [milkInStock, setMilkInStock] = useState(0);
    const [toDaysInStock, setToDaysInStock] = useState(0);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setIsMilkLoading(true);
                await Promise.all([fetchMilkAmount(), fetchTodaysStock()]);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsMilkLoading(false);
            }
        };

        fetchStockData();
    }, []);

    const fetchMilkAmount = async () => {
        const response = await fetch('/api/milk/get-milk-amount');
        const result = await response.json();
        setMilkInStock(result?.data?.saleMilkAmount || 0);
    };

    const fetchTodaysStock = async () => {
        const response = await fetch('/api/milk/get-milk-amount-by-date');
        const result = await response.json();
        setToDaysInStock(result?.data || 0);
    };

    return (
        <section className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    Milk Dashboard
                </h1>
                <Button asChild className="self-start sm:self-auto">
                    <Link href="/milk-production/add-milk-production">
                        <Plus className="mr-2 h-4 w-4" />
                        Milk Collection
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StockCard
                    title="Today's Stock"
                    value={toDaysInStock}
                    isLoading={isMilkLoading}
                    icon={<Calendar className="h-5 w-5" />}
                    gradient="from-blue-50 to-blue-100"
                    textColor="text-blue-800"
                    valueColor="text-blue-900"
                />

                <StockCard
                    title="Milk in Stock"
                    value={milkInStock}
                    isLoading={isMilkLoading}
                    icon={<Milk className="h-5 w-5" />}
                    gradient="from-green-50 to-green-100"
                    textColor="text-green-800"
                    valueColor="text-green-900"
                />
            </div>
        </section>
    );
}

function StockCard({
    title,
    value,
    isLoading,
    icon,
    gradient,
    textColor,
    valueColor,
}: {
    title: string;
    value: number;
    isLoading: boolean;
    icon: React.ReactElement;
    gradient: string;
    textColor: string;
    valueColor: string;
}) {
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
                            {value.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                            Liters
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
