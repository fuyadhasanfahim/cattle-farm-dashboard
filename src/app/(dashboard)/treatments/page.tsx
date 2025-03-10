import DataTable from '@/components/treatments/DataTable';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
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

                <form>
                    <div className="w-full max-w-lg flex items-center px-4 bg-white rounded-md border border-gray-200 shadow group group-focus-visible:ring-1">
                        <Search className="size-5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search Now"
                            className="outline-none ring-0 border-none h-10 w-full shadow-none focus-visible:ring-0"
                        />
                    </div>
                </form>
            </section>

            <DataTable />
        </>
    );
}
