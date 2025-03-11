import dbConfig from '@/lib/dbConfig';
import { FeedPurchaseModel, FeedInventoryModel } from '@/models/feeding.model';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConfig();

        const feedPurchases = await FeedPurchaseModel.find().sort({
            purchaseDate: -1,
        });
        
        const feedInventory = await FeedInventoryModel.find().sort({
            lastUpdated: -1,
        });

        return NextResponse.json(
            {
                success: true,
                feedPurchases,
                feedInventory,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch feed data',
                error,
            },
            { status: 500 }
        );
    }
}
