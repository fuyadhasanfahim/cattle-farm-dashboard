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
    Users,
    Folder,
    Warehouse,
    ClipboardCheck,
    Wallet,
    Scale,
} from 'lucide-react';
import React from 'react';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', link: '/dashboard' },
    { icon: PawPrint, label: 'Manage Cattle', link: '/manage-cattles' },
    { icon: Milk, label: 'Milk Production', link: '/milk-production' },
    { icon: Utensils, label: 'Feeding', link: '/feeding' },
    { icon: BriefcaseMedical, label: 'Treatment', link: '/treatments' },
    { icon: GitPullRequest, label: 'Fattening', link: '/fattening' },
    { icon: Heart, label: 'Animal Breeding', link: '/animal-breeding' },
    { icon: Scale, label: 'Balance', link: '/balance' },
    { icon: Wallet, label: 'Expense', link: '/expense' },
    { icon: Users, label: 'Customer', link: '/customers' },
    { icon: Folder, label: 'Party', link: '/party' },
    { icon: Warehouse, label: 'Inventory', link: '/inventory' },
    { icon: ClipboardCheck, label: 'Reports', link: '/reports' },
];

export default function Sidebar() {
    const path = usePathname();

    return (
        <ScrollArea className="w-full h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50 to-gray-200 shadow-lg">
            <div className="flex flex-col gap-2 p-4">
                {sidebarItems.map(({ icon, label, link }, index) => (
                    <Link href={link} key={index} className="group">
                        <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer shadow-sm
                                ${
                                    path.startsWith(link)
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                                        : 'bg-white hover:bg-green-100 hover:text-green-700'
                                }
                            `}
                        >
                            {React.createElement(icon, {
                                size: 22,
                                className:
                                    'transition-transform duration-200 group-hover:scale-110',
                            })}
                            <span className="font-medium text-sm">{label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </ScrollArea>
    );
}
