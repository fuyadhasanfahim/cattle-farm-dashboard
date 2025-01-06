'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { DatePicker } from '../shared/DatePicker';

const data = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 50 },
    { month: 'Apr', value: 70 },
    { month: 'May', value: 55 },
    { month: 'June', value: 60 },
    { month: 'July', value: 80 },
    { month: 'Aug', value: 45 },
    { month: 'Sep', value: 65 },
    { month: 'Oct', value: 75 },
    { month: 'Nov', value: 90 },
    { month: 'Dec', value: 100 },
];

export default function BarCharts() {
    return (
        <div className="col-span-3 w-[584px] h-[350px] bg-white rounded-2xl shadow border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between">
                <div className="text-[#52aa46] text-lg font-bold font-['FN Mahfuj Rumaysa']">
                    গবাদি পশু
                </div>
                <DatePicker />
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#52aa46" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
