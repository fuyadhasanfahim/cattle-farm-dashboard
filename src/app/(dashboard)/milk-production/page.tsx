import DataTable from '@/components/milk-production/DataTable';
import HeroSection from '@/components/milk-production/HeroSection';

export const dynamic = 'force-dynamic';

export default function page() {
    return (
        <>
            <HeroSection />
            <DataTable />
        </>
    );
}
