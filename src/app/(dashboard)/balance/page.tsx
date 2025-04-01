'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Loader2, Save, ShoppingBasket, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BalanceValidationSchema from '@/validator/balance.validation.schema';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MyCalender from '@/components/shared/MyCalender';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useEffect, useState } from 'react';

export default function BalancePage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const [earning, setEarning] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [due, setDue] = useState<number>(0);

    const form = useForm({
        resolver: zodResolver(BalanceValidationSchema),
        defaultValues: {
            date: new Date(),
            description: '',
            balance: '',
            earning: '',
            expense: '',
            due: '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/balance/get-balances');

                const result = await response.json();

                if (response.ok) {
                    setBalance(
                        result.data.reduce(
                            (acc: number, val: { balance: number }) =>
                                acc + val.balance,
                            0
                        )
                    );
                    setEarning(
                        result.data.reduce(
                            (acc: number, val: { earning: number }) =>
                                acc + val.earning,
                            0
                        )
                    );
                    setExpense(
                        result.data.reduce(
                            (acc: number, val: { expense: number }) =>
                                acc + val.expense,
                            0
                        )
                    );
                    setDue(
                        result.data.reduce(
                            (acc: number, val: { due: number }) =>
                                acc + val.due,
                            0
                        )
                    );
                }
            } catch (error) {
                toast.error((error as Error).message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (
        values: z.infer<typeof BalanceValidationSchema>
    ) => {
        console.log('clicked');
        try {
            const { date, description, balance, earning, expense, due } =
                values;

            const res = await fetch('/api/balance/add-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    balance: Number(balance).toFixed(2),
                    earning: Number(earning).toFixed(2),
                    expense: Number(expense).toFixed(2),
                    due: Number(due).toFixed(2),
                    date,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save transaction');
            }

            toast.success('Transaction added successfully');
            form.reset();
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong');
        }
    };

    return (
        <section className="space-y-6">
            <Dialog>
                <DialogTrigger asChild>
                    <Button size={'lg'}>
                        <ShoppingBasket />
                        Add Balance
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Balance</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-2">
                                <MyCalender
                                    form={form}
                                    label="Balance Date *"
                                    name="date"
                                    placeholder="Select Date"
                                />
                                <FormField
                                    control={form.control}
                                    name="balance"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Enter Balance *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="eg: 50"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Type your message here..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        <X />
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit">
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <Save />
                                    )}
                                    {form.formState.isSubmitting
                                        ? 'Saving...'
                                        : 'Save changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-4 gap-6 items-center">
                <StatCard
                    title="Balance"
                    value={balance}
                    isLoading={loading}
                    icon={<DollarSign className="h-5 w-5" />}
                    gradient="from-green-50 to-green-100"
                    textColor="text-green-800"
                    valueColor="text-green-900"
                    unit="Taka"
                    format={(val) => val.toFixed(2)}
                />

                <StatCard
                    title="Total Earnings"
                    value={earning}
                    isLoading={loading}
                    icon={<DollarSign className="h-5 w-5" />}
                    gradient="from-yellow-50 to-yellow-100"
                    textColor="text-yellow-800"
                    valueColor="text-yellow-900"
                    unit="Taka"
                    format={(val) => val.toFixed(2)}
                />

                <StatCard
                    title="Total Expenses"
                    value={expense}
                    isLoading={loading}
                    icon={<DollarSign className="h-5 w-5" />}
                    gradient="from-blue-50 to-blue-100"
                    textColor="text-blue-800"
                    valueColor="text-blue-900"
                    unit="Taka"
                    format={(val) => val.toFixed(2)}
                />

                <StatCard
                    title="Total Due"
                    value={due}
                    isLoading={loading}
                    icon={<DollarSign className="h-5 w-5" />}
                    gradient="from-red-50 to-red-100"
                    textColor="text-red-800"
                    valueColor="text-red-900"
                    unit="Taka"
                    format={(val) => val.toFixed(2)}
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
        <Card className="overflow-hidden">
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
