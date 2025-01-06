import BarCharts from './BarCharts';
import PieCharts from './PieCharts';
import SecondPieChart from './SecondPieChart';

export default async function Charts() {
    return (
        <div className="flex items-center gap-4">
            <BarCharts />
            <PieCharts />
            <SecondPieChart />
        </div>
    );
}
