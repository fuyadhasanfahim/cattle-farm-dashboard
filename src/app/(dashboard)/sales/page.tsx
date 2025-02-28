import DataTable from '@/components/sales/DataTable';
import HeroSection from '@/components/sales/HeroSection';

export const dynamic = 'force-dynamic';

export default function page() {
    return (
        <>
            <HeroSection />
            <DataTable />
        </>
    );
}
