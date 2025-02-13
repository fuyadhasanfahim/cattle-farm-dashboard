import { DatePicker } from '../shared/DatePicker';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import getLoggedInUser from '@/services/user/getLoggedInUser';

export default async function HeroSection() {
    const user = await getLoggedInUser();

    return (
        <section className="py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="size-11">
                        <AvatarImage
                            src={user?.image || ''}
                            alt={`${user?.name}' profile image`}
                        />
                        <AvatarFallback>...</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-[#313131] text-base font-normal font-inter">
                            {user?.name}
                        </h3>
                        <p className="text-[#666666] text-xs font-normal font-inter">
                            Welcome to farming dashboards!
                        </p>
                    </div>
                </div>

                <DatePicker />
            </div>
        </section>
    );
}
