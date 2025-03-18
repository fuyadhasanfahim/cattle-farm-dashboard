import HeroSection from '@/components/dashboard/HeroSection';
import TopDashboardCard from '@/components/dashboard/TopDashboardCard';
import Charts from '@/components/dashboard/Charts';
import BottomPieChart from '@/components/dashboard/BottomPieChart';

export default async function dashboard() {
    return (
        <>
            <HeroSection />

            <div className="py-6">
                <TopDashboardCard />
            </div>

            <div className="py-6">
                <Charts />
            </div>

            <div className="py-6">
                <BottomPieChart />
            </div>
        </>
    );
}
