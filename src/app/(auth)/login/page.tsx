import LoginPage from '@/components/auth/login/LoginPage';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function page() {
    const session = await getServerSession();

    if (session?.user) {
        redirect('/');
    }

    return <LoginPage />;
}
