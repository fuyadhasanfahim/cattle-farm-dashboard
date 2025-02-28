import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AddSales() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    বিক্রয়ের জন্য বিষয় সিলেক্ট করুন
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <Link href={'/sales/add-sales/add-milk'}>
                        <button className="btn-primary">দুধ</button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
