'use client';

import icons from '@/assets/icons/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

const {
    accounts,
    animalBreeding,
    dashboard,
    deworming,
    fatFreshening,
    feeding,
    inventoryManagement,
    loneManagement,
    manageCattles,
    milkProductions,
    party,
    report,
    sale,
    supplier,
    treatment,
    vaccination,
} = icons;

const sidebarItems = [
    {
        id: 1,
        icon: dashboard,
        label: 'ড্যাশবোর্ড',
        link: '/',
    },
    {
        id: 2,
        icon: manageCattles,
        label: 'ম্যানেজ গবাদিপশু',
        link: '/manage-cattles',
    },
    {
        id: 3,
        icon: milkProductions,
        label: 'দুধ উৎপাদন',
        link: '/milk-production',
    },
    {
        id: 4,
        icon: feeding,
        label: 'ফিডিং',
        link: '/feeding',
    },
    {
        id: 5,
        icon: deworming,
        label: 'ডিওয়ার্মিং',
        link: '/deworming',
    },
    {
        id: 6,
        icon: vaccination,
        label: 'টিকাদান',
        link: '/vaccination',
    },
    {
        id: 7,
        icon: treatment,
        label: 'ট্রিটমেন্ট',
        link: '/treatment',
    },
    {
        id: 8,
        icon: fatFreshening,
        label: 'মোটাতাজাকরণ',
        link: '/fattening',
    },
    {
        id: 9,
        icon: animalBreeding,
        label: 'পশু প্রজনন',
        link: '/animal-breeding',
    },
    {
        id: 10,
        icon: sale,
        label: 'বিক্রয়',
        link: '/sales',
    },
    {
        id: 11,
        icon: party,
        label: 'পার্টি',
        link: '/party',
    },
    {
        id: 12,
        icon: supplier,
        label: 'সরবরাহকারী',
        link: '/supplier',
    },
    {
        id: 13,
        icon: accounts,
        label: 'একাউন্টস',
        link: '/accounts',
    },
    {
        id: 14,
        icon: inventoryManagement,
        label: 'ইনভেন্টরি ম্যানেজমেন্ট',
        link: '/inventory-management',
    },
    {
        id: 15,
        icon: loneManagement,
        label: 'লোন ম্যানেজমেন্ট',
        link: '/loan-management',
    },
    {
        id: 16,
        icon: report,
        label: 'রিপোর্ট',
        link: '/reports',
    },
];

export default function Sidebar() {
    const path = usePathname();

    return (
        <ScrollArea className="w-full bg-white h-[calc(100vh)] border-r">
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
                            {icon}
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
