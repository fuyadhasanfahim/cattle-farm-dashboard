'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    BadgeDollarSign,
    DollarSign,
    Droplet,
    Milk,
    ShoppingBasket,
} from 'lucide-react';
import AddPurchase from '@/components/expense/AddPurchase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseDataTable from '@/components/expense/ExpenseDataTable';
import SalesDataTable from '@/components/expense/SalesDataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import { ISales } from '@/types/sales.interface';
import AddSale from '@/components/expense/AddSale';

export default function ExpensePage() {
    const [loading, setLoading] = useState(true);
    const [milkLoading, setMilkLoading] = useState(true);
    const [todaysMilk, setTodaysMilk] = useState(0);
    const [milkInStockLoading, setMilkInStockLoading] = useState(false);
    const [milkInStock, setMilkInStock] = useState(0);
    const [totalFullAmount, setTotalFullAmount] = useState(0);
    const [totalDueAmount, setTotalDueAmount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchSalesData(),
                    fetchTodaysMilk(),
                    fetchMilkAmount(),
                ]);
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

            setTotalFullAmount(fullAmount || 0);
            setTotalDueAmount(dueAmount || 0);
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

            setTodaysMilk(result?.data || 0);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setMilkLoading(false);
        }
    };

    const fetchMilkAmount = async () => {
        setMilkInStockLoading(true);
        try {
            const response = await fetch(`/api/milk/get-milk-amount`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            setMilkInStock(result?.data?.saleMilkAmount || 0);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setMilkInStockLoading(false);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={'lg'}>
                            <ShoppingBasket />
                            Add Purchase
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl !pr-0">
                        <ScrollArea className="h-[80vh] pr-8">
                            <DialogHeader>
                                <DialogTitle className="text-3xl text-green-500">
                                    Add Purchase Form
                                </DialogTitle>
                            </DialogHeader>

                            <AddPurchase />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={'lg'}>
                            <BadgeDollarSign />
                            Add Sale
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl !pr-0">
                        <ScrollArea className="h-[80vh] pr-8">
                            <DialogHeader>
                                <DialogTitle className="text-3xl text-green-500">
                                    Add Sale Form
                                </DialogTitle>
                            </DialogHeader>

                            <AddSale />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    title="Milk in Stock"
                    value={milkInStock}
                    isLoading={milkInStockLoading}
                    icon={<Milk className="h-5 w-5" />}
                    gradient="from-yellow-50 to-yellow-100"
                    textColor="text-yellow-800"
                    valueColor="text-yellow-900"
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
                    format={(val) => val.toFixed(2)}
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
                    format={(val) => val.toFixed(2)}
                />
            </div>

            <div className="">
                <Tabs defaultValue="PurchaseHistory">
                    <TabsList>
                        <TabsTrigger value="PurchaseHistory">
                            Purchase History
                        </TabsTrigger>
                        <TabsTrigger value="SalesHistory">
                            Sales History
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="PurchaseHistory">
                        <ExpenseDataTable />
                    </TabsContent>
                    <TabsContent value="SalesHistory">
                        <SalesDataTable />
                    </TabsContent>
                </Tabs>
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
