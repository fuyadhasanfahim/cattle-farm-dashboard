'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, Milk, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { IFeeding } from '@/types/feeding.interface';
import { format } from 'date-fns';

export default function FeedingDetails() {
    const { id } = useParams();
    const [data, setData] = useState<IFeeding | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/feeding/get-feeding?id=${id}`
                );

                const result = await response.json();

                if (response.ok) {
                    setData(result.data);
                }
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async (id: string) => {
        if (!id) return;

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this record?'
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `/api/feeding/delete-feeding?id=${id}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                toast.success('ডেটা সফলভাবে মুছে ফেলা হয়েছে');

                router.push('/feeding');
            } else {
                toast.error('ডেটা মুছে ফেলার সময় কিছু সমস্যা হয়েছে।');
            }
        } catch (error) {
            toast.error(
                (error as Error).message ||
                    'ডেটা মুছে ফেলার সময় কিছু সমস্যা হয়েছে।'
            );
        }
    };

    if (loading) {
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
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

    return (
        <section className="min-h-screen">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="bg-green-50 border-b border-green-100 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-500 text-white rounded-full">
                            <Milk size={28} />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-green-700">
                                Feeding Details
                            </CardTitle>
                            <p className="text-green-600 mt-1">
                                Viewing details of: {data._id}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                        title="খাদ্যের ধরণ"
                        value={data.খাদ্যের_ধরণ}
                        icon="🥬"
                    />

                    <InfoCard
                        title="খাদ্যের পরিমাণ"
                        value={`${data.খাদ্যের_পরিমাণ} KG`}
                        icon="🥗"
                        highlight={true}
                    />

                    <InfoCard
                        title="তারিখ"
                        value={format(data.তারিখ, 'MMMM dd, yyyy')}
                        icon="📆"
                        highlight={true}
                    />

                    <InfoCard
                        title="পেমেন্টের ধরণ"
                        value={data.পেমেন্টের_ধরণ}
                        icon="💳"
                        highlight={true}
                    />

                    <InfoCard
                        title="প্রতি কেজির দাম"
                        value={`${data.প্রতি_কেজির_দাম} TAKA`}
                        icon="💰"
                    />

                    <InfoCard
                        title="মোট_দাম"
                        value={`${data.মোট_দাম} TAKA`}
                        icon="💎"
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
                                    `/feeding/update-feeding/${data._id}`
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
                                ? 'text-xl font-bold text-green-600 font-notoSansBengali'
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
