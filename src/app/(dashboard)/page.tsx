import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function dashboard() {
    const session = await getServerSession();

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
                accusamus ducimus provident cupiditate dolorum? Beatae a quasi
                nostrum. Tempore, rerum sapiente ea exercitationem eius cumque
                maxime consequuntur aut totam veniam.
            </p>
        </div>
    );
}
