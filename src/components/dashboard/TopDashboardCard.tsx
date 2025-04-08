import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Circle } from 'lucide-react';
import { getAllCattails } from '@/actions/cattle.action';
import { ICattle } from '@/types/cattle.interface';
import { getAllBreedings } from '@/actions/breeding.action';
import IBreeding from '@/types/breeding.interface';
import { getAllMilkProductions } from '@/actions/milk-production.action';
import { IMilkProduction } from '@/types/milk.production.interface';

export default async function TopDashboardCard() {
    const cattails = await getAllCattails();
    const breedings = await getAllBreedings();
    const milkProductions = await getAllMilkProductions();

    const males = cattails.filter(
        (cattle: ICattle) => cattle.gender === 'Male'
    );
    const females = cattails.filter(
        (cattle: ICattle) => cattle.gender === 'Female'
    );

    const pending = breedings.filter(
        (breeding: IBreeding) =>
            breeding.checkForSemenSuccessStatus === 'Pending'
    );
    const failed = breedings.filter(
        (breeding: IBreeding) =>
            breeding.checkForSemenSuccessStatus === 'Failed'
    );
    const successful = breedings.filter(
        (breeding: IBreeding) =>
            breeding.checkForSemenSuccessStatus === 'Successful'
    );

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const calculateMilkProduction = (startDate: Date, endDate: Date) => {
        return milkProductions
            .filter((production: IMilkProduction) => {
                if (!production.milkCollectionDate) return false;
                const productionDate = new Date(production.milkCollectionDate);
                return productionDate >= startDate && productionDate <= endDate;
            })
            .reduce(
                (total: number, production: IMilkProduction) =>
                    total + (Number(production.milkQuantity) || 0),
                0
            );
    };

    const todayMilkProduction = milkProductions
        .filter((production: IMilkProduction) => {
            if (!production.milkCollectionDate) return false;
            return new Date(production.milkCollectionDate)
                .toISOString()
                .startsWith(todayDate);
        })
        .reduce(
            (total: number, production: IMilkProduction) =>
                total + (Number(production.milkQuantity) || 0),
            0
        );

    const monthMilkProduction = calculateMilkProduction(firstDayOfMonth, today);
    const yearMilkProduction = calculateMilkProduction(firstDayOfYear, today);

    const dashboardData = [
        {
            title: 'Registered Cattle',
            description: 'Total count of registered male and female cattle',
            stats: [
                {
                    label: 'Males',
                    value: males.length,
                    icon: <Circle className="w-3 h-3 text-blue-500" />,
                },
                {
                    label: 'Females',
                    value: females.length,
                    icon: <Circle className="w-3 h-3 text-pink-500" />,
                },
            ],
            badge: cattails.length,
            image: 'https://iili.io/2UXRcXV.png',
            trend: males.length > females.length ? 'up' : 'down',
            color: 'bg-blue-50',
        },
        {
            title: 'Breeding Status',
            description: 'Overview of breeding success rates',
            stats: [
                {
                    label: 'Pending',
                    value: pending.length,
                    icon: <Circle className="w-3 h-3 text-yellow-500" />,
                },
                {
                    label: 'Failed',
                    value: failed.length,
                    icon: <Circle className="w-3 h-3 text-red-500" />,
                },
                {
                    label: 'Successful',
                    value: successful.length,
                    icon: <Circle className="w-3 h-3 text-green-500" />,
                },
            ],
            badge: breedings.length,
            image: 'https://iili.io/2UXRazQ.png',
            trend: successful.length > failed.length ? 'up' : 'down',
            color: 'bg-purple-50',
        },
        {
            title: 'Milk Production',
            description: 'Summary of milk production by period',
            stats: [
                {
                    label: 'Today',
                    value: `${todayMilkProduction.tofixed(2)} L`,
                    icon: <Circle className="w-3 h-3 text-cyan-500" />,
                },
                {
                    label: 'Monthly',
                    value: `${monthMilkProduction.tofixed(2)} L`,
                    icon: <Circle className="w-3 h-3 text-teal-500" />,
                },
                {
                    label: 'Yearly',
                    value: `${yearMilkProduction.tofixed(2)} L`,
                    icon: <Circle className="w-3 h-3 text-blue-500" />,
                },
            ],
            badge: `${yearMilkProduction} L`,
            image: 'https://iili.io/2UXRE11.png',
            trend:
                monthMilkProduction > todayMilkProduction * 25 ? 'up' : 'down',
            color: 'bg-cyan-50',
        },
        {
            title: 'Sales Overview',
            description: 'Financial summary of all sales',
            stats: [
                {
                    label: 'Today',
                    value: `$${123}`,
                    icon: <Circle className="w-3 h-3 text-green-500" />,
                    subtext: `Due: $${0}`,
                },
                {
                    label: 'Monthly',
                    value: `$${123}`,
                    icon: <Circle className="w-3 h-3 text-emerald-500" />,
                    subtext: `Due: $${0}`,
                },
                {
                    label: 'Yearly',
                    value: `$${123}`,
                    icon: <Circle className="w-3 h-3 text-lime-500" />,
                    subtext: `Due: $${0}`,
                },
            ],
            badge: `$${13}`,
            image: 'https://iili.io/2UXR7mx.png',
            trend: 123 > 123 * 15 ? 'up' : 'down',
            color: 'bg-green-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {dashboardData.map((card, index) => (
                <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-green-200 font-inter w-full"
                >
                    <CardHeader className={`pb-2 ${card.color} rounded-t-lg`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-green-700 text-base font-bold">
                                    {card.title}
                                </CardTitle>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-white/80 text-green-700"
                            >
                                {card.trend === 'up' ? (
                                    <ArrowUp className="mr-1 h-3 w-3 text-green-600" />
                                ) : (
                                    <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                                )}
                                {card.badge}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-3">
                                {card.stats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center space-x-2"
                                    >
                                        {stat.icon}
                                        <div>
                                            <p className="text-gray-700 text-sm">
                                                <span className="font-medium">
                                                    {stat.label}:
                                                </span>{' '}
                                                {stat.value}
                                            </p>
                                            {'subtext' in stat && (
                                                <p className="text-gray-500 text-xs">
                                                    {stat.subtext}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                className={`${card.color} p-3 rounded-full shadow-sm`}
                            >
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    width={65}
                                    height={55}
                                    className="object-contain transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
