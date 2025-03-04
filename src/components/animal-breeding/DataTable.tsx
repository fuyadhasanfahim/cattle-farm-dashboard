'use client';

import IBreeding from '@/types/breeding.interface';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DataTable() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<IBreeding[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(`/api/breeding/get-all-breedings`);
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
                Animal Breeding Data
            </h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-500">
                        <tr>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed rounded-tl-lg  text-white uppercase tracking-wider">
                                Serial No
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider">
                                Mothers Id
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed text-white uppercase tracking-wider">
                                Semen Date
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                Breed Type
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                Approximate BirthDate
                            </th>
                            <th className="px-6 py-3 text-base font-semibold border border-dashed  text-white uppercase tracking-wider text-center">
                                Semen Percentage
                            </th>
                            <th className="px-6 py-3 text-center text-base font-semibold border border-dashed rounded-tr-lg text-white uppercase tracking-wider">
                                Action
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
                                        {item.mothersId}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {format(
                                            item.semenDate,
                                            'MMMM dd, yyyy'
                                        )}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.breedType}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {format(
                                            item.approximateBirthDate,
                                            'MMMM dd, yyyy'
                                        )}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.semenPercentage}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        <div
                                            className="w-full flex items-center justify-center gap-2 group hover:cursor-pointer"
                                            onClick={() =>
                                                handleViewDetails(item._id!)
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
