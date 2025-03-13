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

            <div>
                <Button variant={'outline'} disabled>
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        `${data.reduce(
                            (total, item) => total + item.totalStock,
                            0
                        )} KG`
                    )}
                </Button>
            </div>
        </section>
    );
}
