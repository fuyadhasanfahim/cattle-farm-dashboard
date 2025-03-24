'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { IMilkProduction } from '@/types/milk.production.interface';
import { getAllMilkProductions } from '@/actions/milk-production.action';
import dayjs from 'dayjs';

const chartConfig: ChartConfig = {
    milk: {
        label: 'Milk Quantity',
        color: 'hsl(var(--chart-1))',
    },
};

export default function MilkProductionChart() {
    const [data, setData] = useState<{ date: string; quantity: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawData: IMilkProduction[] =
                    await getAllMilkProductions();

                const groupedData = rawData.reduce((acc, item) => {
                    const formattedDate = dayjs(item.milkCollectionDate).format(
                        'MMM DD'
                    );

                    if (!acc[formattedDate]) {
                        acc[formattedDate] = 0;
                    }

                    acc[formattedDate] += Number(item.milkQuantity) || 0;
                    return acc;
                }, {} as Record<string, number>);

                const last30Days = Array.from({ length: 12 }, (_, i) =>
                    dayjs().subtract(i, 'day').format('MMM DD')
                );

                const finalData = last30Days.map((date) => ({
                    date,
                    quantity: groupedData[date] || 0,
                }));

                const sortedData = finalData.sort((a, b) =>
                    dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1
                );

                setData(sortedData);
            } catch (error) {
                console.error('Error fetching milk production data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Milk Production Bar Chart</CardTitle>
                <CardDescription>Last 30 Days</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-[300px]"
                >
                    <BarChart data={data}>
                        <CartesianGrid vertical={true} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={true}
                            angle={0}
                            interval={0}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="quantity"
                            fill="hsl(var(--chart-5))"
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
