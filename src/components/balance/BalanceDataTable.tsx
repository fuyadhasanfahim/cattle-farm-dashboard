import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import CustomPagination from '../shared/CustomPagination';
import { IBalance } from '@/types/balance.interface';
import { cn } from '@/lib/utils';

export default function BalanceDataTable() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<IBalance[]>([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/balance/get-paginate-balances?search=${search}&limit=${itemsPerPage}&page=${currentPage}`
                );

                const result = await response.json();

                if (response.ok) {
                    setData(result.data || []);
                    setTotalPages(result.pagination.totalPages);
                } else {
                    toast.error('Failed to fetch data');
                    setData([]);
                    setTotalPages(1);
                }
            } catch (error) {
                toast.error((error as Error).message);
                setData([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, search]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    return (
        <Card className="border border-gray-100 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-700 text-white">
                <CardTitle className="text-xl flex items-center justify-between">
                    <div>Transaction History</div>
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 top-[9.5px] h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 font-medium text-black bg-gray-50 border-gray-200 rounded-md w-full"
                            />
                        </div>

                        <Select
                            onValueChange={handleItemsPerPageChange}
                            value={String(itemsPerPage)}
                        >
                            <SelectTrigger className="bg-white font-medium text-black w-24">
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
                                <TableRow className="bg-gray-50">
                                    <TableHead className="border-r text-center">
                                        Serial
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Transaction Date
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Balance
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Expense
                                    </TableHead>
                                    <TableHead className="border-r text-center">
                                        Earnings
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Due
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map(
                                    (
                                        {
                                            date,
                                            balance,
                                            due,
                                            earning,
                                            expense,
                                        },
                                        index
                                    ) => (
                                        <TableRow key={index}>
                                            <TableCell className="border-r text-center">
                                                {(currentPage - 1) *
                                                    itemsPerPage +
                                                    index +
                                                    1}
                                            </TableCell>
                                            <TableCell className="border-r text-center">
                                                {format(new Date(date), 'PPP')}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'border-r text-center',
                                                    (balance as number) < 0
                                                        ? 'text-red-500'
                                                        : (balance as number) >
                                                          0
                                                        ? 'text-green-500'
                                                        : 'text-yellow-500'
                                                )}
                                            >
                                                {balance} Taka
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'border-r text-center',
                                                    (expense as number) < 0
                                                        ? 'text-red-500'
                                                        : (expense as number) >
                                                          0
                                                        ? 'text-green-500'
                                                        : 'text-yellow-500'
                                                )}
                                            >
                                                {expense} Taka
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'border-r text-center',
                                                    (earning as number) < 0
                                                        ? 'text-red-500'
                                                        : (earning as number) >
                                                          0
                                                        ? 'text-green-500'
                                                        : 'text-yellow-500'
                                                )}
                                            >
                                                {earning} Taka
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-center',
                                                    (due as number) < 0
                                                        ? 'text-red-500'
                                                        : (due as number) > 0
                                                        ? 'text-green-500'
                                                        : 'text-yellow-500'
                                                )}
                                            >
                                                {due} Taka
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
