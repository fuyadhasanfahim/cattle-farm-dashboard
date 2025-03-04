import DataTable from '@/components/animal-breeding/DataTable';
import HeroSection from '@/components/animal-breeding/HeroSection';

export const dynamic = 'force-dynamic';

export default async function page() {
    return (
        <section className="h-full min-h-screen overflow-hidden">
            <HeroSection />
            <DataTable />
        </section>
    );
}
