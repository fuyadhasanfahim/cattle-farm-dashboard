import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section>
            <Link href={'/customers/add-customer'} className="btn-primary">
                <Plus size={20} />
                <span>Add Customer</span>
            </Link>
        </section>
    );
}
