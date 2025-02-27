'use client';

import { IMilkProduction } from '@/types/milk.production.interface';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DataTable() {
    const [data, setData] = useState<IMilkProduction[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    '/api/milk-production/get-all-milk-production'
                );
                const result = await response.json();
                setData(result);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLocationChange = (id: string) => {
        router.push(`/milk-production/details/${id}`);
    };

    return (
        <section className="min-h-screen my-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                দুধ উৎপাদন ডেটা
            </h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-500">
                        <tr>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed rounded-tl-lg  text-white uppercase tracking-wider">
                                ট্যাগ আইডি
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                গবাদি পশুর ধরণ
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                দুধের পরিমাণ
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                দুধ সংগ্রহের তারিখ
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                ফ্যাট শতাংশ
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                সময়
                            </th>
                            <th className="px-6 py-3 text-center text-base font-semibold border border-dashed rounded-tr-lg text-white uppercase tracking-wider">
                                অ্যাকশন
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-3 text-center"
                                >
                                    লোড হচ্ছে...
                                </td>
                            </tr>
                        ) : data?.length > 0 ? (
                            data.map((item) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.গবাদি_পশুর_ট্যাগ_আইডি}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.গবাদি_পশুর_ধরণ}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.দুধের_পরিমাণ} লিটার
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.দুধ_সংগ্রহের_তারিখ
                                            ? format(
                                                  new Date(
                                                      item.দুধ_সংগ্রহের_তারিখ
                                                  ),
                                                  'dd-MM-yy'
                                              )
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.ফ্যাট_শতাংশ}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.সময়}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        <div
                                            className="w-full flex items-center justify-center gap-2 group hover:cursor-pointer"
                                            onClick={() =>
                                                handleLocationChange(item._id)
                                            }
                                        >
                                            <Eye className="size-5 group-hover:text-yellow-500" />
                                            <span className="font-inter group-hover:underline">
                                                View Details
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-3 text-center"
                                >
                                    কোন তথ্য পাওয়া যায়নি।
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
