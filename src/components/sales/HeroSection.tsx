'use client';

import { ISales } from '@/types/sales.interface';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

export default function HeroSection() {
    const [data, setData] = useState<ISales[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/sales/get-sales`);
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    toast.error(result.message || 'Failed to fetch sales data');
                }
            } catch (error) {
                toast.error(
                    (error as Error).message || 'An unexpected error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalSalesAmount = data?.reduce(
        (sum, sale) => sum + sale.totalPrice,
        0
    );
    const totalDueAmount = data?.reduce((sum, sale) => sum + sale.dueAmount, 0);

    return (
        <section className="flex items-center justify-between">
            <Button>
                <Link
                    href={'/sales/add-sales'}
                    className="flex items-center gap-2"
                >
                    <Plus className="size-5" />
                    <span className="font-medium">Add Sales</span>
                </Link>
            </Button>

            <div className="mt-4 md:mt-0">
                <h2 className="text-lg font-semibold text-gray-700">
                    Total Sales Amount:{' '}
                    <span className="text-green-600">
                        {loading
                            ? 'Loading...'
                            : `${totalSalesAmount || 0} Taka`}
                    </span>
                </h2>
                <h2 className="text-lg font-semibold text-gray-700 mt-1">
                    Total Due Amount:{' '}
                    <span className="text-red-500">
                        {loading ? 'Loading...' : `${totalDueAmount || 0} Taka`}
                    </span>
                </h2>
            </div>
        </section>
    );
}
