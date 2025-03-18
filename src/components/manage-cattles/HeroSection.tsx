'use client';

import { PlusIcon } from 'lucide-react';
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
                            <span>Add a Cattle</span>
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
            </div>
        </section>
    );
}
