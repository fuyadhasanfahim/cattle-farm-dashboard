import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function getLoggedInUser() {
    try {
        const session = await getServerSession();

        if (!session) redirect('/login');

        const user = session.user;
        if (!user) redirect('/login');

        return user;
    } catch (error) {
        if (error) {
            redirect('/login');
        }
    }
}
