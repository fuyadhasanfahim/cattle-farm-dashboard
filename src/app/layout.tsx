import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--',
    weight: ['400', '900'],
});

export const metadata: Metadata = {
    title: 'Dashboard | Cattle Farm',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="bn">
            <body
                className={`${inter.variable} antialiased`}
            >
                {children}
                <Toaster position="bottom-right" reverseOrder={false} />
            </body>
        </html>
    );
}
