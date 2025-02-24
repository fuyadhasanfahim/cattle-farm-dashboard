'use client';

import { ICattle } from '@/types/cattle.interface';
import { format } from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    Edit2,
    Eye,
    Search,
    Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export default function DataTable() {
    const [tableData, setTableData] = useState<ICattle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const headers = [
        'ট্যাগ_আইডি',
        'রেজিষ্ট্রেশনের_তারিখ',
        'স্টল_নম্বর',
        'জাত',
        'বাবার_নাম',
        'পার্সেন্টেজ',
        'ওজন',
        'লিঙ্গ',
        'মোটাতাজা_করন_স্ট্যাটাস',
        'অবস্থান',
        'অ্যাকশন',
    ];

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `/api/cattle/get-cattles-data?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}&search=${searchQuery}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log(data);

            setTableData(data.data || []);
            setPagination((prev) => ({
                ...prev,
                totalItems: data.totalItems || 0,
                totalPages: Math.ceil(
                    (data.totalItems || 0) / pagination.itemsPerPage
                ),
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('তথ্য লোড করতে সমস্যা হয়েছে');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(debounceTimer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage, searchQuery]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
        }
    };

    const handleEditClick = (id: string) => {
        router.push(`/manage-cattles/edit-cattle-data/${id}`);
    };

    const handleDeleteCattle = async (id: string) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            'আপনি কি নিশ্চিত যে আপনি এই তথ্যটি মুছতে চান?'
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/cattle/delete-cattle?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTableData((prev) =>
                    prev.filter((cattle) => cattle._id !== id)
                );
                toast.success('সফল, গবাদিপশুর তথ্য সফলভাবে মুছে ফেলা হয়েছে');
                // Refetch data if needed to update pagination
                if (tableData.length === 1 && pagination.currentPage > 1) {
                    setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                    }));
                } else {
                    fetchData();
                }
            } else {
                throw new Error('মুছে ফেলা যায়নি');
            }
        } catch (error) {
            console.error('Error deleting cattle:', error);
            toast.error('ত্রুটি! গবাদিপশুর তথ্য মুছে ফেলা যায়নি');
        }
    };

    const renderPaginationNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;
        let startPage = Math.max(1, pagination.currentPage - 1);
        const endPage = Math.min(
            pagination.totalPages,
            startPage + maxVisiblePages - 1
        );

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <div
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-2 rounded-lg cursor-pointer ${
                        pagination.currentPage === i
                            ? 'bg-[#52aa46] text-white'
                            : 'border border-[#666666] text-[#666666]'
                    } justify-center items-center gap-2 flex`}
                >
                    <div className="text-xs font-normal font-notoSansBengali">
                        {i.toString().padStart(2, '০')}
                    </div>
                </div>
            );
        }
        return pages;
    };

    return (
        <section className="space-y-6">
            <form
                className="relative w-[433px] h-[45px]"
                onSubmit={(e) => e.preventDefault()}
            >
                <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-muted-foreground size-4" />
                <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="অনুসন্ধান করুণ"
                    className="w-full h-full pl-10 pr-3 bg-white rounded-lg focus:border-[#52aa46] placeholder:text-muted-foreground outline outline-1 outline-[#52aa46] focus:outline-2"
                />
            </form>

            <div className="overflow-x-auto">
                <table className="w-full bg-[#52aa46] rounded-t-lg">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="text-white font-notoSansBengali border border-dashed p-2 py-3"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="bg-white">
                                <td
                                    colSpan={headers.length}
                                    className="text-center p-4 font-notoSansBengali"
                                >
                                    লোড হচ্ছে...
                                </td>
                            </tr>
                        ) : tableData.length === 0 ? (
                            <tr className="bg-white">
                                <td
                                    colSpan={headers.length}
                                    className="text-center p-4 font-notoSansBengali"
                                >
                                    কোন তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="bg-white">
                                    <td className="p-2 text-center border border-dashed">
                                        {row.ট্যাগ_আইডি}
                                    </td>
                                    <td className="p-2 text-center border border-dashed">
                                        {row.রেজিষ্ট্রেশনের_তারিখ
                                            ? format(
                                                  new Date(
                                                      row.রেজিষ্ট্রেশনের_তারিখ
                                                  ),
                                                  'dd-MM-yy'
                                              )
                                            : null}
                                    </td>
                                    <td className="p-2 border border-dashed">
                                        {row.স্টল_নম্বর}
                                    </td>
                                    <td className="p-2 border border-dashed">
                                        {row.জাত}
                                    </td>
                                    <td className="p-2 border border-dashed">
                                        {row.বাবার_নাম}
                                    </td>
                                    <td className="p-2 text-center border border-dashed">
                                        {row.পার্সেন্টেজ}
                                    </td>
                                    <td className="p-2 text-center border border-dashed">
                                        {row.ওজন}
                                    </td>
                                    <td className="p-2 border border-dashed">
                                        {row.লিঙ্গ}
                                    </td>
                                    <td className="p-2 text-center border border-dashed">
                                        {row.মোটাতাজা_করন_স্ট্যাটাস}
                                    </td>
                                    <td className="p-2 border border-dashed">
                                        {row.অবস্থান}
                                    </td>
                                    <td className="p-2 border border-dashed">
                                        <div className="flex items-center justify-between gap-2 mx-auto">
                                            <Eye className="size-5 cursor-pointer hover:text-green-600 transition-all" />
                                            <Edit2
                                                className="size-5 cursor-pointer hover:text-yellow-600 transition-all"
                                                onClick={() =>
                                                    handleEditClick(row._id)
                                                }
                                            />
                                            <Trash2
                                                onClick={() =>
                                                    handleDeleteCattle(row._id)
                                                }
                                                className="size-5 cursor-pointer hover:text-red-600 transition-all"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isLoading && tableData.length > 0 && (
                <div className="h-8 justify-start items-center gap-2 inline-flex">
                    <div
                        onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                        }
                        className={`px-4 py-2 rounded-lg border border-[#666666] justify-center items-center gap-2 flex cursor-pointer ${
                            pagination.currentPage === 1
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        <ChevronLeft className="size-4" />
                        <span className="text-[#666666] font-normal font-notoSansBengali">
                            পূর্ববর্তী
                        </span>
                    </div>

                    {renderPaginationNumbers()}

                    <div
                        onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                        }
                        className={`px-4 py-2 rounded-lg border border-[#666666] justify-center items-center gap-2 flex cursor-pointer ${
                            pagination.currentPage === pagination.totalPages
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        <span className="text-[#666666] font-normal font-notoSansBengali">
                            পরবর্তী
                        </span>
                        <ChevronRight className="size-4" />
                    </div>
                </div>
            )}
        </section>
    );
}
