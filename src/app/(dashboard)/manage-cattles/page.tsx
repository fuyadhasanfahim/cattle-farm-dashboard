import DataTable from '@/components/manage-cattles/DataTable';
import HeroSection from '@/components/manage-cattles/HeroSection';

export const dynamic = 'force-dynamic'

export default async function page() {
    return (
        <section className="h-full min-h-screen max-h-full">
            <HeroSection />
            <DataTable />
        </section>
    );
}
