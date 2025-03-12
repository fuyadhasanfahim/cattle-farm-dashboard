import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function HeroSection() {
    return (
        <section className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link href={'/feeding/add-feeding'}>
                    <Button>
                        <Plus className="size-5" />
                        <span>Add Feeding</span>
                    </Button>
                </Link>

                <Link href={'/feeding/add-feed'}>
                    <Button>
                        <Plus className="size-5" />
                        <span>Add Feed</span>
                    </Button>
                </Link>
            </div>
        </section>
    );
}
