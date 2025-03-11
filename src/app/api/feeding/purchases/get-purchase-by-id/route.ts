import dbConfig from '@/lib/dbConfig';
import { FeedPurchaseModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid ID or id not specified!',
                },
                { status: 400 }
            );
        }

        await dbConfig();

        const feedPurchases = await FeedPurchaseModel.findById(id).sort({
            purchaseDate: -1,
        });

        return NextResponse.json(
            {
                success: true,
                feedPurchases,
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
