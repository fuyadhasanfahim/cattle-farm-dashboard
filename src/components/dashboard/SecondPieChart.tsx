'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const data = [
    { name: 'গবাদি পশু', value: 75 },
    { name: 'দুধ বিক্র', value: 25 },
];

const COLORS = ['#52aa46', '#f59004'];

export default function SecondPieChart() {
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="col-span-1 w-[350px] h-[350px] bg-white rounded-2xl shadow border p-6">
            <div className="font-bold text-[#52aa46]">লাভের পরিমান</div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-4">
                <div className="text-[#313131] text-center text-lg font-bold font-['FN Mahfuj Rumaysa']">
                    মোট: 3,00,000 ৳
                </div>

                <ul className="flex items-center gap-2">
                    <li className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-[#52aa46] rounded"></div>
                        <p className="text-black text-sm">
                            গবাদি পশু: ২,৫০,০০০৳
                        </p>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-[#f59004] rounded"></div>
                        <p className="text-black text-sm">দুধ বিক্র: ৫০,০০০৳</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
