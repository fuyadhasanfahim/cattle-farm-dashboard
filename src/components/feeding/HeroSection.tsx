'use client';

import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { IFeedInventory } from '@/types/feeding.interface';
import toast from 'react-hot-toast';

export default function HeroSection() {
    const [data, setData] = useState<IFeedInventory[] | []>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const res = await fetch(
                    '/api/feeding/inventories/get-inventory'
                );
                if (!res.ok) throw new Error('Failed to fetch data');
                const { inventory } = await res.json();

                setData(inventory);
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
        <section className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link href={'/feeding/add-feeding'}>
                    <Button>
                        <Plus className="size-5" />
                        <span>Purchase Feed</span>
                    </Button>
                </Link>

                <Link href={'/feeding/add-feed'}>
                    <Button>
                        <Plus className="size-5" />
                        <span>Add Feed</span>
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col items-start gap-2 p-4 border rounded-md bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">
                    Current Stock:
                </h3>
                <div className="flex flex-wrap gap-2">
                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-600">
                            <Loader2 className="animate-spin" size={16} />
                            Loading...
                        </div>
                    ) : data && data.length > 0 ? (
                        data.map(({ feedType, totalStock }, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                                {feedType}: {totalStock} KG
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500">
                            No stock data available.
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}
