'use client';

import { ICattle } from '@/types/cattle.interface';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select,
} from '../ui/select';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import Link from 'next/link';
import CustomPagination from '../shared/CustomPagination';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

export default function DataTable() {
    const [data, setData] = useState<ICattle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
                setData(result.data || []);

                setTotalItems(result.pagination?.totalItems);
            } catch (error) {
                toast.error((error as Error).message || 'Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, searchQuery]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    return (
        <Card className="border border-gray-100 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                <CardTitle className="text-xl flex items-center justify-between">
                    <div>Cattle List</div>
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
                {isLoading ? (
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
                ) : data.length === 0 ? (
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
                                        Tag ID
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        {`Mother's ID`}
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Birth Date
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Breed
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Gender
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Milking and Dry Status
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Fattening
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        {`Father's ID`}
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        {`Father's Name`}
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map(
                                    (
                                        {
                                            _id,
                                            tagId,
                                            gender,
                                            breed,
                                            fatteningStatus,
                                            fatherId,
                                            fatherName,
                                            motherId,
                                            dateOfBirth,
                                            MilkingAndDryStatus,
                                            profileImage,
                                            description,
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
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TableCell className="border-r text-center flex items-center justify-center gap-3 cursor-pointer">
                                                            {tagId}
                                                            <figure className="relative w-8 h-8 overflow-hidden rounded-full">
                                                                <Image
                                                                    src={
                                                                        profileImage
                                                                    }
                                                                    alt={`Profile image of ${tagId}`}
                                                                    layout="fill"
                                                                    objectFit="cover"
                                                                    priority
                                                                />
                                                            </figure>
                                                        </TableCell>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-md p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 text-black dark:text-white">
                                                        <div className="flex items-center gap-4">
                                                            <figure className="rounded-md overflow-hidden aspect-square border border-black/5 relative w-24 h-24">
                                                                <Image
                                                                    src={
                                                                        profileImage
                                                                    }
                                                                    alt={`Profile image of ${tagId}`}
                                                                    layout="fill"
                                                                    objectFit="cover"
                                                                    priority
                                                                />
                                                            </figure>
                                                            <div>
                                                                <p className="text-lg font-semibold">
                                                                    ID: {tagId}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {
                                                                        description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TableCell className="border-r text-center">
                                                {motherId}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {dateOfBirth
                                                    ? format(dateOfBirth, 'PP')
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {breed}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {gender}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'border-r text-center text-white',
                                                    MilkingAndDryStatus ===
                                                        'Active'
                                                        ? 'bg-green-500'
                                                        : 'bg-yellow-500'
                                                )}
                                            >
                                                {MilkingAndDryStatus}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'border-r text-center text-white',
                                                    fatteningStatus === 'Active'
                                                        ? 'bg-green-500'
                                                        : 'bg-yellow-500'
                                                )}
                                            >
                                                {fatteningStatus}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {fatherId}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {fatherName}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link
                                                    href={`/manage-cattles/details/${_id}`}
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

                {!isLoading && totalPages > 0 && (
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
