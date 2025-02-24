import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        <main>
            <header className="w-full">
                <Navbar />
            </header>
            <div className="flex">
                <div className="sticky top-0 left-0 w-full max-w-[250px] h-screen">
                    <Sidebar />
                </div>
                <section className="w-full h-full">
                    <div className="w-full bg-[#fbfff1] h-full min-h-[calc(100vh-80px)] p-4">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}
