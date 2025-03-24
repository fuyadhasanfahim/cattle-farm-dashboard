import { ChevronDown, Loader2, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { getUserData } from '@/actions/user.action';
import LogoutButton from '@/hooks/userLogout';

export default async function Navbar() {
    const user = await getUserData();

    return (
        <nav className="px-4 md:px-6 lg:px-10 border-b h-20 backdrop-blur w-full flex items-center">
            <div className="w-full flex items-center justify-between">
                <Image
                    src={
                        'https://res.cloudinary.com/dny7zfbg9/image/upload/mivlaitetix6paxle3yw.png'
                    }
                    alt="logo"
                    width={60}
                    height={60}
                />

                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors duration-200">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage
                                    src={user?.profileImage || ''}
                                    alt={`${user?.name}'s profile image`}
                                />
                                <AvatarFallback className="bg-primary/10">
                                    <Loader2 className="animate-spin" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium leading-none">
                                        {user?.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {user?.email}
                                    </span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="end">
                        <div className="flex flex-col gap-1">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 font-normal"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 font-normal"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                            <LogoutButton />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </nav>
    );
}
