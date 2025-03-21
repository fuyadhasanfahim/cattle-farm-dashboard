'use client';

import { IMilkProduction } from '@/types/milk.production.interface';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Milk, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Details() {
    const { id } = useParams();
    const [data, setData] = useState<IMilkProduction | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/milk-production/get-milk-production-by-id?id=${id}`
                );
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!data?._id) return;

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this record?'
        );
        if (!confirmDelete) return;

        try {
            setDeleting(true);

            const response = await fetch(
                `/api/milk-production/delete-milk-production?id=${data._id}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                toast.success('Milk production data processed successfully.');

                router.push('/milk-production');
            } else {
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        if (errorData.message.includes('negative')) {
                            toast.error(
                                'The resulting milk amount would be negative. Please adjust the quantities.'
                            );
                        } else if (errorData.message.includes('not found')) {
                            toast.error(
                                'Milk production entry not found. Please verify the ID.'
                            );
                        } else if (errorData.message.includes('permission')) {
                            toast.error(
                                'You do not have permission to perform this action.'
                            );
                        } else {
                            toast.error(errorData.message);
                        }
                    } else {
                        if (response.status === 400) {
                            toast.error(
                                'Bad request. Please check your input data.'
                            );
                        } else if (response.status === 404) {
                            toast.error('Resource not found.');
                        } else if (response.status === 500) {
                            toast.error(
                                'Internal server error. Please try again later.'
                            );
                        } else {
                            toast.error(
                                response.statusText ||
                                    'An unexpected error occurred.'
                            );
                        }
                    }
                } catch {
                    toast.error(
                        'Failed to process the request. Please check your network connection or try again.'
                    );
                }
            }
        } catch (error) {
            toast.error((error as Error).message || 'Error deleting record');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-medium mb-4">Record not found</h2>
                <Button onClick={() => router.push('/milk-production')}>
                    Back to List
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <div className="bg-white p-2 rounded-full text-green-500">
                        <Milk className="h-6 w-6" />
                    </div>
                    Milk Production Details
                </h1>
            </div>

            <Card className="mb-6">
                <CardHeader className="bg-green-500 rounded-t-lg">
                    <CardTitle className="text-lg text-white">
                        Total Milk: {data.milkQuantity} liters
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Cattle Tag ID
                            </p>
                            <p className="font-medium">{data.cattleTagId}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Saleable Quantity
                            </p>
                            <p className="font-medium">
                                {data.milkQuantity} liters
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Fat Percentage
                            </p>
                            <p className="font-medium">
                                {data.fatPercentage
                                    ? `${data.fatPercentage}%`
                                    : 'N/A'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                                Collection Time
                            </p>
                            <p className="font-medium">{data.time}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push('/milk-production')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(
                                `/milk-production/update-milk-production/${data._id}`
                            )
                        }
                        className="flex items-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
