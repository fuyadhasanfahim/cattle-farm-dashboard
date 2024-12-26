import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="bg-[#fbfff1] h-screen flex items-center justify-center w-full">
            {children}
        </div>
    );
}
