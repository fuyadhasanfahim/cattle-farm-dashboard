'use client';

import { ICustomer } from '@/types/customer.interface';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DataTable() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ICustomer[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(
                    `/api/customers/get-all-customers`
                );
                const result = await response.json();

                setData(result.data);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

    const handleViewDetails = (id: string) => {
        router.push(`/customers/details/${id}`);
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
                                ক্রমিক নং
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider">
                                নাম
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                মোবাইল নম্বর
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                ঠিকানা
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                গ্রাহকের ধরণ
                            </th>
                            <th className="px-6 py-3 text-center text-base font-semibold border border-dashed rounded-tr-lg text-white uppercase tracking-wider">
                                অ্যাকশন
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-3 text-center"
                                >
                                    লোড হচ্ছে...
                                </td>
                            </tr>
                        ) : data?.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.নাম}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.মোবাইল_নম্বর}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.ঠিকানা}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.গ্রাহকের_ধরণ}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        <div
                                            className="w-full flex items-center justify-center gap-2 group hover:cursor-pointer"
                                            onClick={() =>
                                                handleViewDetails(item._id)
                                            }
                                        >
                                            <Eye className="size-5 group-hover:text-yellow-500" />
                                            <span className=" group-hover:underline">
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
