'use client';

import { useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { ITreatment } from '@/types/treatment.interface';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CustomPagination from '../shared/CustomPagination';
import toast from 'react-hot-toast';

export default function TreatmentTable() {
    const [data, setData] = useState<ITreatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sort, setSort] = useState('Cattle ID');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/treatments/get-treatments?search=${searchQuery}&sort=${sort}&limit=${itemsPerPage}&page=${currentPage}`
                );
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to fetch data');
                }

                setData(result.data);
                setTotalItems(result.totalRecords);
            } catch (err) {
                toast.error((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, searchQuery, sort]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(parseInt(value, 10));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Card className="font-inter shadow-xl border border-gray-100 rounded-xl overflow-hidden mt-6">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                <CardTitle className="text-xl flex items-center justify-between">
                    <div>Sales List</div>
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 top-[9.5px] h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
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

                        <Select
                            onValueChange={handleSortChange}
                            value={String(sort)}
                        >
                            <SelectTrigger className="w-32 bg-white border-gray-200 rounded-md font-medium text-black">
                                <SelectValue placeholder="Items" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cattle ID">
                                    Cattle ID
                                </SelectItem>
                                <SelectItem value="Next Due Date">
                                    Next Due Date
                                </SelectItem>
                                <SelectItem value="Treatment Date">
                                    Treatment Date
                                </SelectItem>
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
                                        Cattle ID
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Treatment Type
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Medicine Name
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Treatment Date
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Next Due Date
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Vaccination Interval
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Deworming Count
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Vaccination Count
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        General Count
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
                                            cattleId,
                                            treatmentType,
                                            treatmentDate,
                                            medicineName,
                                            nextDueDate,
                                            vaccinationCount,
                                            dewormingCount,
                                            generalCount,
                                            vaccinationInterval,
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
                                                {cattleId}
                                            </TableCell>

                                            <TableCell className="border-r text-center">
                                                {treatmentType}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {medicineName}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {treatmentDate
                                                    ? format(
                                                          treatmentDate,
                                                          'PPP'
                                                      )
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {nextDueDate
                                                    ? format(nextDueDate, 'PPP')
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {vaccinationInterval
                                                    ? vaccinationInterval
                                                    : 0}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {vaccinationCount}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {dewormingCount}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {generalCount}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link
                                                    href={`/treatments/details/${_id}`}
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

                {!loading && totalItems > 0 && (
                    <div className="mt-6 flex justify-center">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalItems}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
