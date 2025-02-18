'use client';

import { ChevronLeft, ChevronRight, Edit2, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CattleData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export default function DataTable() {
    const [tableData, setTableData] = useState<CattleData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
    });
    const [isLoading, setIsLoading] = useState(true);

    const headers = [
        'ক্রমিক নং',
        'ট্যাগ আইডি',
        'রেজিষ্ট্রেশন তাং',
        'বয়স/মাস',
        'স্টল নাং',
        'ওজন/কেজি',
        'গবাদিপশুর লিঙ্গ',
        'মোটাতাজা করন স্ট্যাটাস',
        'গবাদিপশুর ধরন',
        'গবাদিপশুর ক্যাটাগরি',
        'স্থানান্তর/বিক্রয়',
        'মৃত অবস্থা',
        'বিবরন',
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/cattle/get-cattles-data?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}&search=${searchQuery}`
            );
            const result = await response.json();

            console.log(result.data);

            if (result.success) {
                setTableData(result?.data);
                setPagination({
                    currentPage: result.pagination.currentPage,
                    totalPages: result.pagination.totalPages,
                    totalItems: result.pagination.totalItems,
                    itemsPerPage: result.pagination.itemsPerPage,
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
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
                    className={`p-3 rounded-lg cursor-pointer ${
                        pagination.currentPage === i
                            ? 'bg-[#52aa46] text-white'
                            : 'border border-[#666666] text-[#666666]'
                    } justify-center items-center gap-2 flex`}
                >
                    <div className="text-xs font-normal font-['FN Shorif Borsha Bijoy52']">
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
                                    className="text-white font-normal font-['FN Shorif Borsha Bijoy52'] border border-dashed p-3"
                                >
                                    {header}
                                </th>
                            ))}

                            <th className="text-white font-normal font-['FN Shorif Borsha Bijoy52'] border border-dashed p-3">
                                অ্যাকশান
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="bg-white">
                                <td
                                    colSpan={headers.length}
                                    className="text-center p-4"
                                >
                                    লোড হচ্ছে...
                                </td>
                            </tr>
                        ) : tableData.length === 0 ? (
                            <tr className="bg-white">
                                <td
                                    colSpan={headers.length}
                                    className="text-center p-4"
                                >
                                    কোন তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="bg-white">
                                    {headers.map((header, colIndex) => {
                                        console.log('Header:', header);
                                        console.log('Row data:', row[header]);
                                        return (
                                            <td
                                                key={colIndex}
                                                className="p-3 border border-dashed"
                                            >
                                                {row[header] || ''}
                                            </td>
                                        );
                                    })}

                                    <td className="p-3 border border-dashed">
                                        <div className="flex items-center gap-2 mx-auto">
                                            <Edit2 className="size-5 cursor-pointer hover:text-yellow-600 transition-all" />
                                            <Trash2 className="size-5 cursor-pointer hover:text-red-600 transition-all" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="h-8 justify-start items-center gap-2 inline-flex">
                <div
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className={`px-4 py-2 rounded-lg border border-[#666666] justify-center items-center gap-2 flex cursor-pointer ${
                        pagination.currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                    }`}
                >
                    <ChevronLeft className="size-4" />
                    <span className="text-[#666666] font-normal font-['FN Shorif Borsha Bijoy52']">
                        পূর্ববর্তী
                    </span>
                </div>

                {renderPaginationNumbers()}

                <div
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className={`px-4 py-2 rounded-lg border border-[#666666] justify-center items-center gap-2 flex cursor-pointer ${
                        pagination.currentPage === pagination.totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                    }`}
                >
                    <span className="text-[#666666] font-normal font-['FN Shorif Borsha Bijoy52']">
                        পরবর্তী
                    </span>
                    <ChevronRight className="size-4" />
                </div>
            </div>
        </section>
    );
}
