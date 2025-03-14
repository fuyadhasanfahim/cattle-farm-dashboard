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
import { IFeedingLog } from '@/types/feeding.interface';
import { format } from 'date-fns';
import Link from 'next/link';

export default function FeedingHistory({
    loading,
    feedLogs,
}: {
    loading: boolean;
    feedLogs: IFeedingLog[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Feeding History</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Table>
                        <TableCaption>List of all feed purchases</TableCaption>
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
                                <TableCell colSpan={7} className="text-center">
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
    );
}
