import HeroSection from '@/components/dashboard/HeroSection';
import LineChartComponent from '@/components/dashboard/LineChart';
import { PieChartComponent } from '@/components/dashboard/PieChart';
import TopDashboardCard from '@/components/dashboard/TopDashboardCard';

export default async function dashboard() {
    return (
        <div className="space-y-6">
            <HeroSection />
            <TopDashboardCard />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                    <LineChartComponent />
                </div>
                <PieChartComponent />
            </div>
        </div>
    );
}
