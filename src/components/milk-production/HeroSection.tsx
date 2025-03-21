'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function HeroSection() {
    const [isMilkLoading, setIsMilkLoading] = useState(false);
    const [milkInStock, setMilkInStock] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsMilkLoading(true);

                const response = await fetch('/api/milk/get-milk-amount');

                const result = await response.json();

                setMilkInStock(result?.data?.saleMilkAmount || 0);
            } catch (error) {
                toast.error((error as Error).message);
            } finally {
                setIsMilkLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="flex items-center justify-between">
            <Link
                href={'/milk-production/add-milk-production'}
                className="btn-primary"
            >
                <Plus className="size-5" />
                <span>Milk Collection</span>
            </Link>

            <div>
                <h2 className="text-xl font-semibold">Milk in Stock</h2>
                <p className="text-3xl font-bold">
                    {isMilkLoading ? 'Loading...' : milkInStock.toFixed(2)}{' '}
                    Liter
                </p>
            </div>
        </section>
    );
}
