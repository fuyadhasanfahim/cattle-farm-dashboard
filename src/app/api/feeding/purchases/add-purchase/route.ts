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

        let balance;
        let due;
        let expense;

        if (paymentType === 'Paid') {
            balance = -totalPrice;
            expense = totalPrice;
        } else {
            due = totalPrice;
        }

        await BalanceModel.create({
            balance,
            due,
            expense,
        });

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
