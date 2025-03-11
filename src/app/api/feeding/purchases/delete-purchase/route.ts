import dbConfig from '@/lib/dbConfig';
import { FeedInventoryModel, FeedPurchaseModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'ID is required' },
                { status: 400 }
            );
        }

        await dbConfig();

        const existingPurchase = await FeedPurchaseModel.findById(id);

        if (!existingPurchase) {
            return NextResponse.json(
                { message: 'Feed purchase not found' },
                { status: 404 }
            );
        }

        const { feedType, quantityPurchased } = existingPurchase;

        await FeedInventoryModel.findOneAndUpdate(
            { feedType },
            {
                $inc: { totalStock: -quantityPurchased },
                lastUpdated: new Date(),
            }
        );

        await FeedPurchaseModel.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Feed purchase deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error deleting feed purchase', error },
            { status: 500 }
        );
    }
}
