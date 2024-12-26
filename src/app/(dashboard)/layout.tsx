import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <body>
            <header className="w-full">
                <Navbar />
            </header>
            <div className="flex">
                <div className="sticky top-0 left-0 w-full max-w-xs">
                    <Sidebar />
                </div>
                <main className="w-full h-full">
                    <div className="w-full bg-[#fbfff1]">{children}</div>
                </main>
            </div>
        </body>
    );
}
