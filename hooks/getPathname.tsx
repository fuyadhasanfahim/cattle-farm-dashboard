'use client';

import { usePathname } from 'next/navigation';

export default function GetPathname() {
    const pathname = usePathname();

    return pathname;
}
