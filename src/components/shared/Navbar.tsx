import { Bell, ChevronDown, MessageCircleMore, Search } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default async function Navbar() {
    return (
        <nav className="px-4 md:px-6 lg:px-10 shadow-sm h-20 backdrop-blur w-full flex items-center">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
                <Image
                    src={'/logo/logo.svg'}
                    alt="logo"
                    width={168}
                    height={52}
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
                    <div className="flex items-center gap-2">
                        <Avatar className="size-11">
                            <AvatarImage src="" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                            shadcn
                        </span>
                        <button className="size-6 flex items-center justify-center bg-[#fbfff1] border rounded-full">
                            <ChevronDown className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
