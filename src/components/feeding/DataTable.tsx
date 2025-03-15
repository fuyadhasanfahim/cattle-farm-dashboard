'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PurchaseHistory from './PurchaseHistory';
import FeedingHistory from './FeedingHistory';

export default function DataTable() {
    return (
        <section className="mt-6">
            <Tabs defaultValue="PurchaseHistory">
                <TabsList>
                    <TabsTrigger value="PurchaseHistory">
                        Purchase History
                    </TabsTrigger>
                    <TabsTrigger value="FeedingHistory">
                        Feeding History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="PurchaseHistory">
                    <PurchaseHistory />
                </TabsContent>
                <TabsContent value="FeedingHistory">
                    <FeedingHistory />
                </TabsContent>
            </Tabs>
        </section>
    );
}
