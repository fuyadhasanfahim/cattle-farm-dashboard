'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IFeeding } from '@/types/feeding.interface';
import Link from 'next/link';

export default function DataTable() {
    const [data, setData] = useState<IFeeding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/feeding/get-all-feedings`);
                const { data } = await response.json();

                setData(data);
            } catch (error) {
                console.error('Error fetching milk sales data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md my-10">
            <h1 className="text-2xl font-bold mb-6">বিক্রয় ডেটা</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-500">
                    <tr>
                        <th className="px-3 py-2 text-base font-semibold border border-dashed text-white tracking-wider text-center rounded-tl-lg">
                            Serial No.
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            খাদ্যের_ধরণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            খাদ্যের_পরিমাণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            তারিখ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            পেমেন্টের_ধরণ
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            প্রতি_কেজির_দাম
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            মোট_দাম
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center rounded-tr-lg">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.খাদ্যের_ধরণ}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.খাদ্যের_পরিমাণ} Liter
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.তারিখ
                                        ? format(
                                              new Date(item.তারিখ),
                                              'MMMM dd, yyyy'
                                          )
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.পেমেন্টের_ধরণ}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.প্রতি_কেজির_দাম} Taka
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.মোট_দাম} Taka
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    <div className="w-full flex items-center justify-center">
                                        <Link
                                            href={`/feeding/details/${item._id}`}
                                            className="hover:underline"
                                        >
                                            View
                                        </Link>
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
