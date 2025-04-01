import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AddSales() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Select what to sale</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <Link href={'/sales/add-sales/add-milk'}>
                        <button className="btn-primary">দুধ</button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
