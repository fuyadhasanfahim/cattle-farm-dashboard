'use client';

import { ITreatment } from '@/types/treatment.interface';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    Loader2,
    Pill,
    Settings2,
    Tag,
    Trash2,
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
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';

export default function TreatmentDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ITreatment | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/treatments/get-treatment-by-id?id=${id}`
                );

                const result = await response.json();

                if (response.ok) {
                    setIsLoading(false);

                    setData(result.data);
                } else {
                    toast.error('Something went wrong!');
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'Deworming':
                return 'bg-orange-100 text-orange-800';
            case 'Vaccination':
                return 'bg-green-100 text-green-800';
            case 'General':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return format(date, 'dd MMMM, yyyy');
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `/api/treatments/delete-treatment?id=${id}`
            );

            if (response.status === 200) {
                toast.success('Treatment deleted successfully!');

                router.push('/treatments');
            } else {
                toast.error('Failed to delete treatment!');
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    } else if (!isLoading && !data) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <AlertCircle size={48} className="text-red-500" />
                <h3 className="text-xl font-semibold">
                    No treatment record found
                </h3>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto ">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-fit"
                    >
                        <ArrowLeft />
                        Back to Treatments
                    </Button>

                    <div className="flex items-center gap-3">
                        <Badge
                            className={getBadgeColor(
                                data?.treatmentType as string
                            )}
                        >
                            {data?.treatmentType}
                        </Badge>
                        <span className="text-sm text-gray-500">
                            ID: {data?._id}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Tag className="mr-2 h-5 w-5" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Cattle ID
                                </h3>
                                <p className="text-lg font-semibold">
                                    {data?.cattleId}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Medicine
                                </h3>
                                <p className="text-lg font-semibold">
                                    {data?.medicineName}
                                </p>
                            </div>

                            {data?.medicineReason && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Medicine Reason
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {data?.medicineReason}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Deworming Count
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {data?.dewormingCount}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Medicine Amount
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {data?.medicineAmount}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Vaccination Count
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {data?.vaccinationCount}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        General Count
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {data?.generalCount}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                Treatment Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Treatment Date
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {formatDate(data?.treatmentDate)}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Next Due Date
                                    </h3>
                                    <p className="text-lg font-semibold">
                                        {formatDate(data?.nextDueDate)}
                                    </p>
                                </div>
                            </div>

                            {data?.treatmentType === 'Vaccination' && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                                        Vaccination Interval
                                    </h3>
                                    <div className="flex gap-2">
                                        {[3, 6, 9, 12].map((interval) => (
                                            <Badge
                                                key={interval}
                                                variant={
                                                    data?.vaccinationInterval ===
                                                    interval
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {interval} Months
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">
                                    Treatment Details
                                </h3>
                                <Tabs defaultValue="overview">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="overview">
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="history">
                                            History
                                        </TabsTrigger>
                                        <TabsTrigger value="notes">
                                            Notes
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent
                                        value="overview"
                                        className="p-4"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <Pill className="h-5 w-5 mr-2 text-primary" />
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {data?.medicineName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Administered on{' '}
                                                        {formatDate(
                                                            data?.treatmentDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                This{' '}
                                                {data?.treatmentType.toLowerCase()}{' '}
                                                treatment was recorded for
                                                cattle #{data?.cattleId}.
                                                {data?.nextDueDate &&
                                                    ` The next treatment is scheduled for ${formatDate(
                                                        data?.nextDueDate
                                                    )}.`}
                                            </p>
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="history"
                                        className="p-4"
                                    >
                                        <p className="text-sm text-gray-600">
                                            Treatment history will be displayed
                                            here in a future update.
                                        </p>
                                    </TabsContent>
                                    <TabsContent value="notes" className="p-4">
                                        <p className="text-sm text-gray-600">
                                            No notes have been added to this
                                            treatment record.
                                        </p>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.push(`/treatments/update-treatment/${id}`)
                        }
                        className="w-fit"
                    >
                        <Settings2 />
                        Edit Treatment
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this data and remove from
                                    our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
