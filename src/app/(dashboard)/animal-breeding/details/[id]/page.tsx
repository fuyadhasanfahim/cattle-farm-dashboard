'use client';

import IBreeding from '@/types/breeding.interface';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Details() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<IBreeding | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/breeding/get-breeding-by-id?id=${id}`
                );
                const { data } = await response.json();

                if (response.status === 200) {
                    setData(data);
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, setData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-8 rounded-lg bg-white shadow-md flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                    <div className="text-green-600 text-lg font-medium">
                        লোড হচ্ছে...
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="p-8 rounded-lg bg-white shadow-md text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <div className="text-red-500 text-lg font-medium">
                        ডেটা পাওয়া যায়নি।
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        ফিরে যান
                    </button>
                </div>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this record?'
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `/api/breeding/delete-breeding-data?id=${id}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                toast.success('Deleted successfully.');

                router.push('/animal-breeding');
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <section className="min-h-screen">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="bg-green-50 border-b border-green-100 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-500 text-white rounded-full">
                            🐂
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-green-700">
                                প্রজনন তথ্য
                            </CardTitle>
                            <p className="text-green-600 mt-1">
                                আইডি: {data._id || 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                        title="বাছুর আইডি"
                        value={data.selectId.toString()}
                        icon="🐄"
                    />
                    <InfoCard
                        title="ষাঁড়ের নাম"
                        value={data.bullName}
                        icon="🐂"
                    />
                    <InfoCard
                        title="ষাঁড়ের নম্বর"
                        value={data.bullNumber.toString()}
                        icon="🔢"
                    />
                    <InfoCard
                        title="ষাঁড়ের ধরণ"
                        value={data.bullType}
                        icon="📌"
                    />
                    <InfoCard
                        title="বীজের শতাংশ"
                        value={data.semenPercentage}
                        icon="💉"
                    />
                    <InfoCard
                        title="বীজ কোম্পানির নাম"
                        value={data.semenCompanyName}
                        icon="🏢"
                    />
                    <InfoCard
                        title="বীজের তারিখ"
                        value={format(
                            new Date(data.semenDate),
                            'MMMM dd, yyyy'
                        )}
                        icon="📅"
                    />
                    <InfoCard
                        title="বীজ পরীক্ষা ফলাফল"
                        value={format(
                            new Date(data.checkForSemenSuccessResult),
                            'MMMM dd, yyyy'
                        )}
                        icon="✅"
                    />
                    <InfoCard
                        title="প্রত্যাশিত প্রসবের তারিখ"
                        value={format(
                            new Date(data.approximateBirthdate),
                            'MMMM dd, yyyy'
                        )}
                        icon="👶"
                    />
                    <InfoCard
                        title="বীজ সফলতার অবস্থা"
                        value={data.checkForSemenSuccessStatus}
                        icon="ℹ️"
                    />
                    <InfoCard
                        title="তৈরির তারিখ"
                        value={
                            data.createdAt
                                ? format(
                                      new Date(data.createdAt),
                                      'MMMM dd, yyyy'
                                  )
                                : 'N/A'
                        }
                        icon="🛠️"
                    />
                    <InfoCard
                        title="আপডেটের তারিখ"
                        value={
                            data.updatedAt
                                ? format(
                                      new Date(data.updatedAt),
                                      'MMMM dd, yyyy'
                                  )
                                : 'N/A'
                        }
                        icon="🔄"
                    />
                    <div className="md:col-span-2 flex justify-center gap-5 mt-4">
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-md flex items-center space-x-2"
                        >
                            <ArrowLeft className="size-5" />
                            <span>ফিরে যান</span>
                        </button>
                        <button
                            onClick={() =>
                                router.push(
                                    `/animal-breeding/update-breeding/${data._id}`
                                )
                            }
                            className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow-md flex items-center space-x-2"
                        >
                            <Edit2 className="size-5" />
                            <span>এডিট</span>
                        </button>
                        <button
                            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-md flex items-center space-x-2"
                            onClick={() => handleDelete(data._id!)}
                        >
                            <Trash2 className="size-5" />
                            <span>ডিলিট</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

function InfoCard({
    title,
    value,
    icon,
    highlight = false,
    className = '',
}: {
    title: string;
    value: string | number;
    icon: string;
    highlight?: boolean;
    className?: string;
}) {
    return (
        <div
            className={`rounded-lg overflow-hidden shadow-md border border-green-100 transition-all hover:shadow-lg ${
                highlight ? 'ring-2 ring-green-400' : ''
            } ${className}`}
        >
            <div className="flex items-center p-4 bg-white">
                <div className="flex-shrink-0 text-2xl mr-3">{icon}</div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-700">
                        {title}
                    </h3>
                    <p
                        className={`mt-1 ${
                            highlight
                                ? 'text-xl font-bold text-green-600'
                                : 'text-gray-700'
                        }`}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
