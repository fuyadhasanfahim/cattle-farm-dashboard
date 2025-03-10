'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboard,
    PawPrint,
    Milk,
    Utensils,
    BriefcaseMedical,
    GitPullRequest,
    Heart,
    ShoppingCart,
    Users,
    Folder,
    Package,
    DollarSign,
    BarChart,
} from 'lucide-react';
import React from 'react';

const sidebarItems = [
    {
        id: 1,
        icon: LayoutDashboard,
        label: 'ড্যাশবোর্ড',
        link: '/',
    },
    {
        id: 2,
        icon: PawPrint,
        label: 'ম্যানেজ গবাদিপশু',
        link: '/manage-cattles',
    },
    {
        id: 3,
        icon: Milk,
        label: 'দুধ উৎপাদন',
        link: '/milk-production',
    },
    {
        id: 4,
        icon: Utensils,
        label: 'ফিডিং',
        link: '/feeding',
    },
    {
        id: 7,
        icon: BriefcaseMedical,
        label: 'ট্রিটমেন্ট',
        link: '/treatments',
    },
    {
        id: 8,
        icon: GitPullRequest,
        label: 'মোটাতাজাকরণ',
        link: '/fattening',
    },
    {
        id: 9,
        icon: Heart,
        label: 'পশু প্রজনন',
        link: '/animal-breeding',
    },
    {
        id: 10,
        icon: ShoppingCart,
        label: 'বিক্রয়',
        link: '/sales',
    },
    {
        id: 11,
        icon: Users,
        label: 'কাস্টমার',
        link: '/customers',
    },
    {
        id: 12,
        icon: Folder,
        label: 'পার্টি',
        link: '/party',
    },
    {
        id: 13,
        icon: Package,
        label: 'সরবরাহকারী',
        link: '/supplier',
    },
    {
        id: 14,
        icon: DollarSign,
        label: 'একাউন্টস',
        link: '/accounts',
    },
    {
        id: 15,
        icon: BarChart,
        label: 'ইনভেন্টরি ম্যানেজমেন্ট',
        link: '/inventory-management',
    },
    {
        id: 16,
        icon: DollarSign,
        label: 'লোন ম্যানেজমেন্ট',
        link: '/loan-management',
    },
    {
        id: 17,
        icon: BarChart,
        label: 'রিপোর্ট',
        link: '/reports',
    },
];

export default function Sidebar() {
    const path = usePathname();

    return (
        <ScrollArea className="w-full bg-white h-[calc(100vh-80px)]">
            <div className="flex flex-col gap-2 p-4">
                {sidebarItems.map(({ id, icon, label, link }) => (
                    <Link href={link} key={id}>
                        <div
                            className={`flex items-center gap-2 px-4 py-3 h-10 rounded-lg hover:bg-[#52aa46] hover:text-white duration-200 transition-colors
                                ${
                                    path === link
                                        ? 'bg-[#52aa46] text-white'
                                        : 'bg-transparent'
                                }`}
                        >
                            {React.createElement(icon, { size: 20 })}
                            <span className="font-notoSansBengali">
                                {label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </ScrollArea>
    );
}
