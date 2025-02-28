import AddMilkProduction from '@/components/milk-production/AddMilkProduction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function page() {
    return (
        <Card className="font-notoSansBengali">
            <CardHeader>
                <CardTitle>দুধ সংগ্রহের ফর্ম</CardTitle>
            </CardHeader>
            <CardContent>
                <AddMilkProduction />
            </CardContent>
        </Card>
    );
}
