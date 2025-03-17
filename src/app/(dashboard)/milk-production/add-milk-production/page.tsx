import AddMilkProduction from '@/components/milk-production/AddMilkProduction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function page() {
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Milk Collection Form</CardTitle>
            </CardHeader>
            <CardContent>
                <AddMilkProduction />
            </CardContent>
        </Card>
    );
}
