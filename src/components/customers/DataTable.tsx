'use client';

import { ICustomer } from '@/types/customer.interface';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomPagination from '../shared/CustomPagination';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Search } from 'lucide-react';

export default function DataTable() {
    const [data, setData] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/customers/get-all-customers?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
                );
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                    setTotalItems(result.total);
                } else {
                    toast.error(result.message || 'Failed to fetch customers');
                }
            } catch (error) {
                toast.error(
                    (error as Error).message || 'An unexpected error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, searchQuery]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : 0;

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    return (
        <Card className="shadow-xl border border-gray-100 rounded-xl overflow-hidden mt-6">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                <CardTitle className="text-xl flex items-center justify-between">
                    <div>Sales List</div>
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 top-[9.5px] h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 font-medium text-black bg-gray-50 border-gray-200 rounded-md"
                            />
                        </div>

                        <Select
                            onValueChange={handleItemsPerPageChange}
                            value={String(itemsPerPage)}
                        >
                            <SelectTrigger className="w-24 bg-white border-gray-200 rounded-md font-medium text-black">
                                <SelectValue placeholder="Items" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <DotLottieReact
                            src="https://lottie.host/ad01aa9b-938c-4751-be55-0c462e02e598/Y41Vr71hNi.lottie"
                            style={{
                                width: '100px',
                                height: '100px',
                            }}
                            loop
                            autoplay
                        />
                    </div>
                ) : data?.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 font-medium">
                            No data available.
                        </p>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="border-r text-center">
                                        Serial
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Name
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Mobile Number
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Address
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Customer Type
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map(
                                    (
                                        {
                                            _id,
                                            name,
                                            mobileNumber,
                                            address,
                                            customerType,
                                        },
                                        index
                                    ) => (
                                        <TableRow
                                            key={index}
                                            className={`hover:bg-green-50 transition-colors duration-150 ${
                                                index % 2 === 0
                                                    ? 'bg-white'
                                                    : 'bg-gray-50'
                                            }`}
                                        >
                                            <TableCell className="border-r text-center">
                                                {(currentPage - 1) *
                                                    itemsPerPage +
                                                    index +
                                                    1}
                                            </TableCell>

                                            <TableCell className="border-r text-center">
                                                {name}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {mobileNumber}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {address}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {customerType}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link
                                                    href={`/customers/details/${_id}`}
                                                >
                                                    <span className="hover:text-green-500 hover:underline">
                                                        View
                                                    </span>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {!loading && totalPages > 0 && (
                    <div className="mt-6 flex justify-center">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
