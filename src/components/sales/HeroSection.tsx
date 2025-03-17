'use client';

import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '../ui/input';
import { useState } from 'react';

export default function HeroSection() {
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', query);
    };

    return (
        <section className="flex items-center justify-between">
            <Link href={'/sales/add-sales'} className="btn-primary">
                <Plus className="size-5" />
                <span>Add Sales</span>
            </Link>

            <form onSubmit={handleSearch}>
                <div className="w-full max-w-lg flex items-center px-4 bg-white rounded-md border border-gray-200 shadow group group-focus-visible:ring-1">
                    <Search className="size-5 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search Now"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="outline-none ring-0 border-none h-10 w-full shadow-none focus-visible:ring-0"
                    />
                </div>
            </form>
        </section>
    );
}
