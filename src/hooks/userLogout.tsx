'use client';

import { LogOut } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios('/api/auth/logout');

            router.refresh();
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 font-normal text-red-600 hover:text-red-600 hover:bg-red-100"
        >
            <LogOut className="h-4 w-4" />
            Logout
        </Button>
    );
}
