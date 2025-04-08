import DataTable from '@/components/treatments/DataTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
    return (
        <>
            <section className="flex items-center justify-between">
                <Link
                    href={'/treatments/add-treatment'}
                    className="btn-primary"
                >
                    <Plus className="size-5" />
                    <span>Add Treatment Info</span>
                </Link>
            </section>

            <DataTable />
        </>
    );
}
