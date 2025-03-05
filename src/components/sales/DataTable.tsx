'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ISales } from '@/types/sales.interface';
import { useRouter } from 'next/navigation';

export default function DataTable() {
    const [data, setData] = useState<ISales[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/sales/get-sales`);
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

    const handleLocationChange = (id: string) => {
        router.push(`/sales/details/${id}`);
    };

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
                            Sales Type
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            Sales Amount
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            Sales Date
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            Total Amount
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            Payment Amount
                        </th>
                        <th className="px-6 py-3 text-base font-semibold border border-dashed text-white tracking-wider text-center">
                            Payment Type
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
                                    {item.salesType}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.milkQuantity} Liter
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.salesDate
                                        ? format(
                                              new Date(item.salesDate),
                                              'MMMM dd, yyyy'
                                          )
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.totalPrice} Taka
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.paymentAmount} Taka
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    {item.paymentMethod}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed text-gray-900">
                                    <div className="w-full flex items-center justify-center">
                                        <Eye
                                            className="size-5 hover:text-yellow-500 hover:cursor-pointer"
                                            onClick={() =>
                                                handleLocationChange(item._id!)
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
