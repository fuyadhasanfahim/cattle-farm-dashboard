'use client';

import { ICattle } from '@/types/cattle.interface';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
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
import {
    Edit,
    Trash2,
    Info,
    Calendar,
    Tag,
    Weight,
    MapPin,
    AlertCircle,
} from 'lucide-react';

export default function CattleDetailsPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ICattle | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(`/api/cattle/get-cattle?id=${id}`);
                const result = await response.json();

                if (response.ok) {
                    setData(result.cattle);
                } else {
                    toast.error('Failed to fetch cattle data!');
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
            setDeleteLoading(true);
            const response = await fetch(`/api/cattle/delete-cattle?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Cattle deleted successfully!');
                router.push('/manage-cattles');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to delete cattle!');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Something went wrong!');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = () => {
        router.push(`/manage-cattles/edit-cattle-data/${id}`);
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-12 w-[250px]" />
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-36 w-full rounded-lg" />
                    <Skeleton className="h-36 w-full rounded-lg" />
                    <Skeleton className="h-36 w-full rounded-lg" />
                    <Skeleton className="h-36 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] p-6">
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Data Found</h2>
                <p className="text-muted-foreground mb-6">
                    Cattle with ID: {id} could not be found.
                </p>
                <Button onClick={() => router.push('/cattle')}>
                    Back to Cattle List
                </Button>
            </div>
        );
    }

    const infoSections = [
        {
            title: 'Basic Information',
            items: [
                {
                    label: 'Tag ID',
                    value: data.tagId,
                    icon: <Tag className="h-4 w-4" />,
                },
                {
                    label: 'Registration Date',
                    value: data.registrationDate
                        ? format(data.registrationDate, 'PPP')
                        : 'N/A',
                    icon: <Calendar className="h-4 w-4" />,
                },
                {
                    label: 'Date of Birth',
                    value: data.dateOfBirth
                        ? format(data.dateOfBirth, 'PPP')
                        : 'N/A',
                    icon: <Calendar className="h-4 w-4" />,
                },
                {
                    label: 'Age',
                    value: data.age,
                    icon: <Info className="h-4 w-4" />,
                },
            ],
        },
        {
            title: 'Physical Attributes',
            items: [
                {
                    label: 'Breed',
                    value: data.breed,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Gender',
                    value: data.gender,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Weight',
                    value: `${data.weight} kg`,
                    icon: <Weight className="h-4 w-4" />,
                },
                {
                    label: 'Percentage',
                    value: `${data.percentage}%`,
                    icon: <Info className="h-4 w-4" />,
                },
            ],
        },
        {
            title: 'Classification',
            items: [
                {
                    label: 'Cattle Type',
                    value: data.cattleType,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Cattle Category',
                    value: data.cattleCategory,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Fattening Status',
                    value: data.fatteningStatus,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Location',
                    value: data.location,
                    icon: <MapPin className="h-4 w-4" />,
                },
            ],
        },
        {
            title: 'Lineage',
            items: [
                {
                    label: 'Father Name',
                    value: data.fatherName,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Father ID',
                    value: data.fatherId,
                    icon: <Tag className="h-4 w-4" />,
                },
                {
                    label: 'Mother Name',
                    value: data.motherName,
                    icon: <Info className="h-4 w-4" />,
                },
                {
                    label: 'Mother ID',
                    value: data.motherId,
                    icon: <Tag className="h-4 w-4" />,
                },
            ],
        },
    ];

    return (
        <section className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Cattle Details</h1>
                    <p className="text-muted-foreground mt-1">
                        Complete information about this cattle
                    </p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={handleEdit}
                        className="flex items-center gap-2"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the cattle with
                                    Tag ID: {data.tagId}. This action cannot be
                                    undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    className="overflow-hidden border-l-4"
                    style={{
                        borderLeftColor:
                            data.status === 'Alive' ? '#10b981' : '#ef4444',
                    }}
                >
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="flex items-center justify-between">
                            <span>Status</span>
                            <Badge
                                variant={
                                    data.status === 'Alive'
                                        ? 'outline'
                                        : 'destructive'
                                }
                                className="text-sm py-1"
                            >
                                {data.status}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <p className="font-semibold">Stall Number:</p>
                            <p className="text-lg">
                                {data.stallNumber || 'N/A'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="bg-muted/50">
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p>{data.description || 'No description available.'}</p>
                    </CardContent>
                </Card>
            </div>

            {infoSections.map((section, index) => (
                <Card key={index}>
                    <CardHeader className="bg-muted/50">
                        <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {section.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="space-y-2">
                                    <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                                        {item.icon}
                                        <p>{item.label}:</p>
                                    </div>
                                    <p className="text-lg">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Card>
                <CardFooter className="flex justify-between p-6">
                    <Button variant="outline" onClick={() => router.back()}>
                        Back to List
                    </Button>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the cattle
                                        with Tag ID: {data.tagId}. This action
                                        cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardFooter>
            </Card>
        </section>
    );
}
