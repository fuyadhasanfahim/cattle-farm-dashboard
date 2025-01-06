'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'কৃমিনাশক:06', value: 6 },
    { name: 'টিকাদান:04', value: 4 },
    { name: 'চিকিৎসা:03', value: 3 },
    { name: 'প্রজনন:06', value: 6 },
];

const colors = ['#52aa46', '#f59004', '#5d00ff', '#009dff'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
    const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle,
        fill,
        payload,
    } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

export default function PieCharts() {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (
        _: React.MouseEvent<SVGElement, MouseEvent>,
        index: number
    ) => {
        setActiveIndex(index);
    };

    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className="col-span-2 w-[280px] h-[350px] bg-white rounded-2xl shadow border">
            <div className="text-[#52aa46] text-base font-bold font-['FN Mahfuj Rumaysa'] py-6 px-4">
                গবাদি পশুর চিকিৎসা
            </div>

            <ResponsiveContainer width="100%" height="55%">
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <text
                        x="50%"
                        y="43%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={20}
                    >
                        {`মোট: ${totalValue}`}
                    </text>
                </PieChart>
            </ResponsiveContainer>

            <div className="py-4 px-4 mx-auto flex items-center justify-center">
                <ul className="grid grid-cols-2 gap-3">
                    {data.map((entry, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-sm"
                                style={{
                                    backgroundColor:
                                        colors[index % colors.length],
                                }}
                            />
                            <p className="text-black text-sm font-normal font-['FN Shorif Borsha Bijoy52']">
                                {entry.name}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
