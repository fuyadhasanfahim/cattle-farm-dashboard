'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ITreatment } from '@/types/treatment.interface';
import { format } from 'date-fns';
import Link from 'next/link';

export default function TreatmentTable() {
    const [treatments, setTreatments] = useState<ITreatment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sort, setSort] = useState<string>('cattleId');
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/treatments/get-treatments?sort=${sort}&limit=${limit}&page=${page}`
                );
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to fetch data');
                }

                setTreatments(result.data);
                setTotalPages(result.totalPages || 1);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sort, limit, page]);

    if (loading) {
        return <p className="text-center py-10">Loading treatments...</p>;
    }

    if (error) {
        return <p className="text-center py-10 text-red-500">Error: {error}</p>;
    }

    const renderPaginationItems = () => {
        const items = [];

        items.push(
            <PaginationItem key="first">
                <PaginationLink
                    href="#"
                    isActive={page === 1}
                    onClick={() => setPage(1)}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (page > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(page + 1, totalPages - 1);
            i++
        ) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={page === i}
                        onClick={() => setPage(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (page < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink
                        href="#"
                        isActive={page === totalPages}
                        onClick={() => setPage(totalPages)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <section className=" my-10 space-y-6">
            <div className="flex items-center justify-end gap-4">
                <Select value={sort} onValueChange={(value) => setSort(value)}>
                    <SelectTrigger className="w-[160px] bg-white">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="cattleId">Cattle ID</SelectItem>
                            <SelectItem value="nextDueDate">
                                Next Due Date
                            </SelectItem>
                            <SelectItem value="treatmentDate">
                                Treatment Date
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select
                    value={String(limit)}
                    onValueChange={(value) => {
                        setLimit(Number(value));
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-[160px] bg-white">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Table className="bg-white">
                <TableCaption>List of Cattle Treatments</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Cattle ID</TableHead>
                        <TableHead className="text-center">
                            Treatment Type
                        </TableHead>
                        <TableHead className="text-center">
                            Medicine Name
                        </TableHead>
                        <TableHead className="text-center">
                            Treatment Date
                        </TableHead>
                        <TableHead className="text-center">
                            Next Due Date
                        </TableHead>
                        <TableHead className="text-center">
                            Vaccination Interval
                        </TableHead>
                        <TableHead className="text-center">
                            Deworming Count
                        </TableHead>
                        <TableHead className="text-center">
                            Vaccination Count
                        </TableHead>
                        <TableHead className="text-center">
                            General Count
                        </TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {treatments.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={10}
                                className="text-center py-4"
                            >
                                No treatments found
                            </TableCell>
                        </TableRow>
                    ) : (
                        treatments.map((treatment, index) => (
                            <TableRow key={index} className="hover:bg-gray-100">
                                <TableCell className="font-medium text-center">
                                    {treatment.cattleId}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.treatmentType}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.medicineName}
                                </TableCell>
                                <TableCell className="text-center">
                                    {format(
                                        new Date(treatment.treatmentDate),
                                        'dd MMMM, yyyy'
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.nextDueDate
                                        ? format(
                                              new Date(treatment.nextDueDate),
                                              'dd MMMM, yyyy'
                                          )
                                        : 'N/A'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.vaccinationInterval || 'N/A'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.dewormingCount}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.vaccinationCount}
                                </TableCell>
                                <TableCell className="text-center">
                                    {treatment.generalCount}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Link
                                        href={`/treatments/details/${treatment._id}`}
                                        className="text-green-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={10}>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) {
                                                    setPage(page - 1);
                                                }
                                            }}
                                            style={{
                                                pointerEvents:
                                                    page === 1
                                                        ? 'none'
                                                        : 'auto',
                                                opacity: page === 1 ? 0.5 : 1,
                                            }}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < totalPages) {
                                                    setPage(page + 1);
                                                }
                                            }}
                                            style={{
                                                pointerEvents:
                                                    page === totalPages
                                                        ? 'none'
                                                        : 'auto',
                                                opacity:
                                                    page === totalPages
                                                        ? 0.5
                                                        : 1,
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    );
}
