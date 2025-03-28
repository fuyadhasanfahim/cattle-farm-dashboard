'use client';

import { IPurchase } from '@/types/expense.interface';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BadgeDollarSign,
    Calendar,
    CheckCircle,
    FileText,
    PackageOpen,
    Store,
    Tag,
    Truck,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';

export default function ExpenseDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState<IPurchase | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/expense/purchase/get-purchase?id=${id}`
                );

                const result = await response.json();

                if (response.ok) {
                    setData(result.data);
                } else {
                    toast.error('Failed to fetch purchase data!');
                }
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Something went wrong!'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `/api/expense/purchase/delete-purchase?id=${id}`
            );

            if (response.ok) {
                toast.success('Purchase deleted successfully');
                router.back();
            } else {
                toast.error('Failed to delete purchase');
            }
        } catch (error) {
            toast.error(
                (error as Error).message || 'Failed to delete purchase.'
            );
        }
    };

    const renderDetailItem = (
        icon: React.ReactNode,
        label: string,
        value: string | number | undefined
    ) => (
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            {icon}
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-semibold">{value ?? 'N/A'}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-[100px]" />
                        <Skeleton className="h-[100px]" />
                        <Skeleton className="h-[100px]" />
                        <Skeleton className="h-[100px]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p>No purchase details found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Purchase Details
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                            Detailed information about your purchase
                        </p>
                    </div>
                    <Badge
                        variant={
                            data.paymentStatus === 'Paid'
                                ? 'default'
                                : data.paymentStatus === 'Pending'
                                ? 'destructive'
                                : 'outline'
                        }
                    >
                        {data.paymentStatus}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderDetailItem(
                                    <Tag className="text-blue-500" />,
                                    'Category',
                                    data.category
                                )}
                                {renderDetailItem(
                                    <PackageOpen className="text-green-500" />,
                                    'Item Name',
                                    data.itemName
                                )}
                                {renderDetailItem(
                                    <Truck className="text-purple-500" />,
                                    'Quantity',
                                    data.quantity
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderDetailItem(
                                    <Store className="text-orange-500" />,
                                    'Seller',
                                    data.sellerName
                                )}
                                {renderDetailItem(
                                    <Calendar className="text-red-500" />,
                                    'Purchase Date',
                                    format(new Date(data.purchaseDate), 'PP')
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {renderDetailItem(
                                    <BadgeDollarSign className="text-green-600" />,
                                    'Price per Item',
                                    data.pricePerItem
                                        ? `$${data.pricePerItem.toFixed(2)}`
                                        : 'N/A'
                                )}
                                {renderDetailItem(
                                    <BadgeDollarSign className="text-blue-600" />,
                                    'Total Price',
                                    `$${data.price.toFixed(2)}`
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {renderDetailItem(
                                    <CheckCircle className="text-teal-500" />,
                                    'Payment Amount',
                                    `$${data.paymentAmount.toFixed(2)}`
                                )}
                                {renderDetailItem(
                                    <BadgeDollarSign className="text-red-600" />,
                                    'Due Amount',
                                    data.dueAmount
                                        ? `$${data.dueAmount.toFixed(2)}`
                                        : 'N/A'
                                )}
                            </div>
                        </div>
                    </div>

                    {data.notes && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <FileText className="text-gray-500" />
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Additional Notes
                                </h3>
                            </div>
                            <p className="text-gray-600">{data.notes}</p>
                        </div>
                    )}

                    <div className="mt-6 flex space-x-4">
                        <Link href={`/expense/update/${id}`}>
                            <Button variant="outline">Edit Purchase</Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    Delete Purchase
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={handleDelete}
                                    >
                                        Confirm
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
