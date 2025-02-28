import DataTable from '@/components/customers/DataTable';
import HeroSection from '@/components/customers/HeroSection';

export const dynamic = 'force-dynamic';

export default function page() {
    return (
        <>
            <HeroSection />
            <DataTable />
        </>
    );
}
