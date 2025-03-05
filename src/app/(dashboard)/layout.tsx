import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        <main>
            <header className="w-full sticky top-0 z-50">
                <Navbar />
            </header>
            <div className="flex">
                <div className="fixed top-[80px] left-0 h-screen w-[250px] bg-white shadow-md">
                    <Sidebar />
                </div>
                <section className="w-full ml-[250px]">
                    <div className="w-full bg-[#fbfff1] min-h-[calc(100vh-80px)] p-4 overflow-hidden">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}
