'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { toast } from 'react-hot-toast';
import {
    getBalance,
    getDue,
    getEarnings,
    getExpense,
    getTotalBalance,
} from '@/actions/balance.action';

const chartConfig = {
    earning: {
        label: 'Earnings',
        color: 'hsl(var(--chart-1))',
    },
    expense: {
        label: 'Expenses',
        color: 'hsl(var(--chart-2))',
    },
    balance: {
        label: 'Balance',
        color: 'hsl(var(--chart-3))',
    },
    due: {
        label: 'Due',
        color: 'hsl(var(--chart-4))',
    },
} satisfies ChartConfig;

export function PieChartComponent() {
    const [financialData, setFinancialData] = React.useState<
        { name: string; value: number; fill: string }[]
    >([]);
    const [total, setTotal] = React.useState(0);

    React.useEffect(() => {
        const fetchData = async () => {
            return setTotal(await getTotalBalance());
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const [earning, expense, balance, due] = await Promise.all([
                    getEarnings(),
                    getExpense(),
                    getBalance(),
                    getDue(),
                ]);

                const updatedChartData = [
                    {
                        name: 'Earnings',
                        value: earning || 0,
                        fill: 'hsl(var(--chart-1))',
                    },
                    {
                        name: 'Expenses',
                        value: expense || 0,
                        fill: 'hsl(var(--chart-2))',
                    },
                    {
                        name: 'Balance',
                        value: balance || 0,
                        fill: 'hsl(var(--chart-3))',
                    },
                    {
                        name: 'Due',
                        value: due || 0,
                        fill: 'hsl(var(--chart-4))',
                    },
                ];

                setFinancialData(updatedChartData);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Failed to load financial data'
                );
            }
        }

        fetchData();
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Real-time data summary</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={financialData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {total.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Financials Updated <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing earnings, expenses, balance, and due amounts
                </div>
            </CardFooter>
        </Card>
    );
}
