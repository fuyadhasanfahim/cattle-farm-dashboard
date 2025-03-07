import DataTable from '@/components/manage-cattles/DataTable';
import HeroSection from '@/components/manage-cattles/HeroSection';

export default async function page() {
    return (
        <section className="h-full min-h-screen overflow-hidden">
            <HeroSection />
            <DataTable />
        </section>
    );
}
