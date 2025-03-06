import DataTable from '@/components/feeding/DataTable';
import HeroSection from '@/components/feeding/HeroSection';

export const dynamic = 'force-dynamic';

export default function page() {
    return (
        <section>
            <HeroSection />
            <DataTable />
        </section>
    );
}
