import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
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

        const balance = await BalanceModel.findOne().sort({ createdAt: -1 });

        await BalanceModel.findOneAndUpdate(
            {},
            {
                $set: { balance: balance.balance - totalPrice },
                $inc: { expense: totalPrice },
                date: new Date(),
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
        console.log((error as Error).message);
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
