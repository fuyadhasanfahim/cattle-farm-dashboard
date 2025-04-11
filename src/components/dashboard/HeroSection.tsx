import { getUserData } from '@/actions/user.action';
// import { DatePicker } from '../shared/DatePicker';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2 } from 'lucide-react';

export default async function HeroSection() {
    const user = await getUserData();

    return (
        <section className="py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="size-11">
                        <AvatarImage
                            src={user?.profileImage || ''}
                            alt={`${user?.name}'s profile image`}
                        />
                        <AvatarFallback className="bg-primary/10">
                            <Loader2 className="animate-spin" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-[#313131] text-base font-normal ">
                            Hello, {user?.name}
                        </h3>
                        <p className="text-[#666666] text-xs font-normal ">
                            Welcome to dashboard!
                        </p>
                    </div>
                </div>

                {/* <DatePicker /> */}
            </div>
        </section>
    );
}
