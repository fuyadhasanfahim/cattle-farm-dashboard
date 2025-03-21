'use client';

import { cn } from '@/lib/utils';
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
        router.push(`/animal-breeding/details/${id}`);
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
                            <th className="p-2 text-base font-semibold border border-dashed rounded-tl-lg  text-white">
                                Serial
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed text-white">
                                ID
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed text-white">
                                Date
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed  text-white text-center">
                                Type
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed  text-white text-center">
                                Check Status
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed  text-white text-center">
                                Birthdate
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed  text-white text-center">
                                Percentage
                            </th>
                            <th className="p-2 text-base font-semibold border border-dashed  text-white text-center">
                                Status
                            </th>
                            <th className="p-2 text-center text-base font-semibold border border-dashed rounded-tr-lg text-white">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="p-2 text-center">
                                    লোড হচ্ছে...
                                </td>
                            </tr>
                        ) : data?.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.selectId}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {format(
                                            item.semenDate,
                                            'MMMM dd, yyyy'
                                        )}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.bullName}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {format(
                                            item.checkForSemenSuccessResult,
                                            'MMMM dd, yyyy'
                                        )}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {format(
                                            item.approximateBirthdate,
                                            'MMMM dd, yyyy'
                                        )}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        {item.semenPercentage}
                                    </td>
                                    <td
                                        className={cn(
                                            'p-2 whitespace-nowrap text-sm text-center border border-dashed text-white',
                                            item.checkForSemenSuccessStatus ===
                                                'pending for approval'
                                                ? 'bg-yellow-500'
                                                : item.checkForSemenSuccessStatus ===
                                                  'failed for conceive'
                                                ? 'bg-red-500'
                                                : 'bg-green-500'
                                        )}
                                    >
                                        {item.checkForSemenSuccessStatus}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-sm text-center border border-dashed  text-gray-900">
                                        <div
                                            className="w-full flex items-center justify-center gap-2 group hover:cursor-pointer"
                                            onClick={() =>
                                                handleViewDetails(item._id!)
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
                                <td colSpan={8} className="p-2 text-center">
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
