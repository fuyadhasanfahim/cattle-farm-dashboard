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

export default function DataTable() {
    const [tableData, setTableData] = useState<ICattle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 10;
    const router = useRouter();

    const headers = [
        'Tag ID',
        'Registration Date',
        'Stall Number',
        'Breed',
        "Father's Name",
        'Percentage',
        'Weight',
        'Gender',
        'Fattening Status',
        'Location',
        'Actions',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/cattle/get-cattles-data?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await response.json();
                setTableData(result.data || []);

                setTotalItems(result.pagination?.totalItems);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentPage, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleEditClick = (id: string) => {
        router.push(`/manage-cattles/edit-cattle-data/${id}`);
    };

    const handleDeleteCattle = async (id: string) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this record?'
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/cattle/delete-cattle?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Cattle record deleted successfully');

                setTableData((prev) =>
                    prev.filter((cattle) => cattle._id !== id)
                );
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting cattle:', error);
            toast.error('Error! Failed to delete cattle record');
        }
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const Pagination = () => {
        if (totalPages <= 1 || tableData.length === 0) return null;

        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded-md ${
                        currentPage === i
                            ? 'bg-[#52aa46] text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-1 mx-1 rounded-md border border-gray-300 ${
                        currentPage === 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span>Previous</span>
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 mx-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="mx-1">...</span>}
                    </>
                )}

                {pages}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && (
                            <span className="mx-1">...</span>
                        )}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1 mx-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-1 mx-1 rounded-md border border-gray-300 ${
                        currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100'
                    }`}
                >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </div>
        );
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
                    onChange={handleSearchChange}
                    placeholder="Search..."
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
                                    className="text-white border border-dashed p-2 py-3"
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
                                    className="text-center p-4"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : tableData.length === 0 ? (
                            <tr className="bg-white">
                                <td
                                    colSpan={headers.length}
                                    className="text-center p-4"
                                >
                                    No data found
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

            <Pagination />

            {!isLoading && tableData.length > 0 && (
                <div className="text-center text-sm text-gray-600 mt-2">
                    Total {totalItems} items, Page {currentPage} / {totalPages}
                </div>
            )}
        </section>
    );
}
