'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IFeedingLog } from '@/types/feeding.interface';
import PurchaseHistory from './PurchaseHistory';
import FeedingHistory from './FeedingHistory';

export default function DataTable() {
    const [feedLogs, setFeedLogs] = useState<IFeedingLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/feeding/logs/get-logs');
                if (!res.ok) throw new Error('Failed to fetch data');
                const { data } = await res.json();

                setFeedLogs(data);
            } catch (error) {
                toast.error(
                    (error as Error).message || 'Error fetching feed data'
                );
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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
                    <FeedingHistory loading={loading} feedLogs={feedLogs} />
                </TabsContent>
            </Tabs>
        </section>
    );
}
