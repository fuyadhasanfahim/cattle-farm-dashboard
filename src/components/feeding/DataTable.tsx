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
// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { IFeedingLog, IFeedPurchase } from '@/types/feeding.interface';
import { format } from 'date-fns';
import Link from 'next/link';

export default function DataTable() {
    const [feedData, setFeedData] = useState<IFeedPurchase[]>([]);
    const [feedLogs, setFeedLogs] = useState<IFeedingLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/feeding/purchases/get-purchases');
                if (!res.ok) throw new Error('Failed to fetch data');
                const data = await res.json();
                setFeedData(data.feedPurchases);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Error fetching feed data'
                );
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/feeding/logs/get-logs');
                if (!res.ok) throw new Error('Failed to fetch data');
                const { data } = await res.json();

                setFeedLogs(data);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Error fetching feed data'
                );
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <section>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Feed Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Table>
                            <TableCaption>
                                List of all feed purchases
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Feed Type
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Quantity (kg)
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Price per Kg
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Total Price
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Payment Type
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feedData.length > 0 ? (
                                    feedData.map((feed) => (
                                        <TableRow key={feed._id}>
                                            <TableCell className="text-center">
                                                {feed.feedType}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {feed.quantityPurchased} kg
                                            </TableCell>
                                            <TableCell className="text-center">
                                                ${feed.perKgPrice}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                ${feed.totalPrice}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {feed.paymentType}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {format(
                                                    new Date(feed.purchaseDate),
                                                    'PPP'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link
                                                    href={`/feeding/details/${feed._id}`}
                                                    className="text-green-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center"
                                        >
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center"
                                    >
                                        {/* <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious href="#" />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#">
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive
                                                    >
                                                        2
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#">
                                                        3
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationNext href="#" />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination> */}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Feed Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Table>
                            <TableCaption>
                                List of all feed purchases
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Cattle ID
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Quantity (kg)
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Feed Type
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Date
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feedLogs.length > 0 ? (
                                    feedLogs.map((feed) => (
                                        <TableRow key={feed._id}>
                                            <TableCell className="text-center">
                                                {feed.cattleId
                                                    ? feed.cattleId
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {feed.feedAmount} kg
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {feed.feedType}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {format(
                                                    new Date(feed.feedDate),
                                                    'PPP'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Link
                                                    href={`/feeding/feed-log/details/${feed._id}`}
                                                    className="text-green-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center"
                                        >
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center"
                                    >
                                        {/* <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious href="#" />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#">
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive
                                                    >
                                                        2
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationLink href="#">
                                                        3
                                                    </PaginationLink>
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                                <PaginationItem>
                                                    <PaginationNext href="#" />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination> */}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
