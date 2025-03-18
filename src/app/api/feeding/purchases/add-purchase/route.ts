import dbConfig from '@/lib/dbConfig';
import { FeedInventoryModel, FeedPurchaseModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await dbConfig();

        const {
            feedType,
            quantityPurchased,
            perKgPrice,
            totalPrice,
            paymentType,
        } = await req.json();

        const newPurchase = await FeedPurchaseModel.create({
            feedType,
            quantityPurchased,
            perKgPrice,
            totalPrice,
            paymentType,
        });

        const inventory = await FeedInventoryModel.findOneAndUpdate(
            { feedType },
            {
                $inc: { totalStock: quantityPurchased },
                lastUpdated: new Date(),
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(
            {
                message: 'Feed purchase added',
                purchase: newPurchase,
                inventory,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to add feed purchase',
                error,
            },
            { status: 500 }
        );
    }
}
