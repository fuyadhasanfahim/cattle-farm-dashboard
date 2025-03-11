'use client';

import { Files, PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AddCattle from './AddCattle';
import { ScrollArea } from '../ui/scroll-area';

export default function HeroSection() {
    const [open, setOpen] = useState(false);

    return (
        <section>
            <div className="flex items-center justify-between gap-10 py-6">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-10 px-6 py-2 bg-green-500 hover:bg-[#4a9940] text-white rounded-lg justify-start items-center gap-1 inline-flex">
                            <PlusIcon className="h-4 w-4" />
                            <span>গবাদি পশুর নিবন্ধন</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                        <VisuallyHidden>
                            <DialogTitle>Hidden Title</DialogTitle>
                        </VisuallyHidden>
                        <ScrollArea className="h-[500px] py-6">
                            <AddCattle setOpen={setOpen} />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                <div className="h-[34px] justify-start items-center gap-2 inline-flex">
                    <Button
                        variant={'outline'}
                        className="px-4 py-2 rounded-lg border border-[#666666] justify-start items-center gap-1 flex"
                    >
                        <Files className="w-4 h-4 px-px justify-center items-center flex overflow-hidden" />
                        <div className="text-[#666666] text-xs font-normal font-inter">
                            Copy
                        </div>
                    </Button>

                    <Button
                        variant={'outline'}
                        className="px-4 py-2 rounded-lg border border-[#666666] justify-start items-center gap-1 flex"
                    >
                        <Files className="w-4 h-4 px-px justify-center items-center flex overflow-hidden" />
                        <div className="text-[#666666] text-xs font-normal font-inter">
                            Excel
                        </div>
                    </Button>

                    <Button
                        variant={'outline'}
                        className="px-4 py-2 rounded-lg border border-[#666666] justify-start items-center gap-1 flex"
                    >
                        <Files className="w-4 h-4 px-px justify-center items-center flex overflow-hidden" />
                        <div className="text-[#666666] text-xs font-normal font-inter">
                            CSV
                        </div>
                    </Button>

                    <Button
                        variant={'outline'}
                        className="px-4 py-2 rounded-lg border border-[#666666] justify-start items-center gap-1 flex"
                    >
                        <Files className="w-4 h-4 px-px justify-center items-center flex overflow-hidden" />
                        <div className="text-[#666666] text-xs font-normal font-inter">
                            PDF
                        </div>
                    </Button>
                </div>
            </div>

            <div className="flex items-center py-6">
                <div className="w-full h-[0px] border border-[#ececec]" />
                <div className="text-green-500 w-[700px] text-center text-2xl font-bold font-notoSansBengali px-6 whitespace-nowrap">
                    নিবন্ধিত গবাদি পশুর তালিকা
                </div>
                <div className="w-full h-[0px] border border-[#ececec]" />
            </div>
        </section>
    );
}
