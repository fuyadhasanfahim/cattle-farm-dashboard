'use client';

import { IMilkProduction } from '@/types/milk.production.interface';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, Milk, Trash2 } from 'lucide-react';

export default function Details() {
    const { id } = useParams();
    const [data, setData] = useState<IMilkProduction | null>(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
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
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="bg-green-50 border-b border-green-100">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-500 text-white rounded-full">
                            <Milk size={28} />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-green-700">
                                দুধ উৎপাদন ডিটেইলস
                            </CardTitle>
                            <p className="text-green-600 mt-1">
                                ট্যাগ আইডি: {data.গবাদি_পশুর_ট্যাগ_আইডি}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                        title="গবাদি পশুর ধরণ"
                        value={data.গবাদি_পশুর_ধরণ}
                        icon="🐄"
                    />

                    <InfoCard
                        title="দুধের পরিমাণ"
                        value={`${data.দুধের_পরিমাণ} লিটার`}
                        icon="🥛"
                        highlight={true}
                    />

                    <InfoCard
                        title="দুধ সংগ্রহের তারিখ"
                        value={format(
                            new Date(data.দুধ_সংগ্রহের_তারিখ),
                            'dd-MM-yyyy'
                        )}
                        icon="📅"
                    />

                    <InfoCard
                        title="সেশন"
                        value={format(new Date(data.সেশন), 'dd-MM-yyyy')}
                        icon="🗓️"
                    />

                    <InfoCard title="সময়" value={data.সময়} icon="⏰" />

                    <InfoCard
                        title="তৈরি করা হয়েছে"
                        value={format(
                            new Date(data.createdAt),
                            'dd-MM-yyyy hh:mm a'
                        )}
                        icon="✅"
                    />

                    <InfoCard
                        title="আপডেট করা হয়েছে"
                        value={format(
                            new Date(data.updatedAt),
                            'dd-MM-yyyy hh:mm a'
                        )}
                        icon="🔄"
                        className="md:col-span-2"
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
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow-md flex items-center space-x-2"
                        >
                            <Edit2 className="size-5" />
                            <span>এডিট</span>
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-md flex items-center space-x-2"
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
