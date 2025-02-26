'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ISales } from '@/types/sales.interface';

export default function DataTable() {
    const [data, setData] = useState<ISales[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/sales/get-sales`);
                const { data } = await response.json();

                setData(data);
            } catch (error) {
                console.error('Error fetching milk collection data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLocationChange = (id: string) => {
        console.log('View details for ID:', id);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md my-10">
            <h1 className="text-2xl font-bold mb-6">দুধ সংগ্রহ ডেটা</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-500">
                    <tr>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            ট্যাগ আইডি
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            গবাদি পশুর ধরণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            দুধের পরিমাণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            দুধ সংগ্রহের তারিখ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            সময়
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider text-center">
                            অ্যাকশন
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-4 text-center">
                                লোড হচ্ছে...
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item._id}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.গবাদি_পশুর_ট্যাগ_আইডি}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.গবাদি_পশুর_ধরণ}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.দুধের_পরিমাণ} লিটার
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.বিক্রয়ের_তারিখ
                                        ? format(
                                              new Date(item.বিক্রয়ের_তারিখ),
                                              'dd-MMMM-yyyy'
                                          )
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {format(item.createdAt, 'dd-MMMM-yyyy')}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    <div className="w-full flex items-center justify-center">
                                        <Eye
                                            className="size-5 hover:text-yellow-500 hover:cursor-pointer"
                                            onClick={() =>
                                                handleLocationChange(item._id)
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
