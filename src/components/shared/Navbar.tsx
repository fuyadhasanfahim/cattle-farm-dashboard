import {
    Bell,
    ChevronDown,
    Loader2,
    LogOut,
    MessageCircleMore,
    Search,
    Settings,
    User,
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { getUserData } from '@/actions/user.action';

export const dynamic = 'force-dynamic';

export default async function Navbar() {
    const user = await getUserData();

    return (
        <nav className="px-4 md:px-6 lg:px-10 border-b h-20 backdrop-blur w-full flex items-center">
            <div className="w-full flex items-center justify-between">
                <Image
                    src={'/logo/logo.png'}
                    alt="logo"
                    width={60}
                    height={60}
                />

                <form className="relative w-[433px] h-[45px]">
                    <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-muted-foreground size-4" />
                    <input
                        type="search"
                        placeholder="অনুসন্ধান করুণ"
                        className="w-full h-full pl-10 pr-3 bg-[#fbfff1] rounded-lg focus:border-[#52aa46] placeholder:text-muted-foreground outline outline-1 outline-[#52aa46] focus:outline-2"
                    />
                </form>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button className="size-11 flex items-center justify-center bg-[#fbfff1] border rounded-full">
                            <Bell className="size-5" />
                        </button>
                        <button className="size-11 flex items-center justify-center bg-[#fbfff1] border rounded-full">
                            <MessageCircleMore className="size-5" />
                        </button>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors duration-200">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage
                                        src={user?.profileImage || ''}
                                        alt={`'s profile image`}
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
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 font-normal text-red-600 hover:text-red-600 hover:bg-red-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </nav>
    );
}
