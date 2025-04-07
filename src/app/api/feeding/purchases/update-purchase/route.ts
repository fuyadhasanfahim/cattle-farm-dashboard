import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { FeedInventoryModel, FeedPurchaseModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        await dbConfig();

        const {
            feedType,
            quantityPurchased,
            perKgPrice,
            totalPrice,
            paymentType,
        } = await req.json();

        const existingPurchase = await FeedPurchaseModel.findById(id);
        if (!existingPurchase) {
            return NextResponse.json(
                { message: 'Feed purchase not found' },
                { status: 404 }
            );
        }

        if (quantityPurchased !== existingPurchase.quantityPurchased) {
            const quantityDiff =
                quantityPurchased - existingPurchase.quantityPurchased;

            await FeedInventoryModel.findOneAndUpdate(
                { feedType },
                {
                    $inc: { totalStock: quantityDiff },
                    lastUpdated: new Date(),
                }
            );
        }

        if (totalPrice !== existingPurchase.totalPrice) {
            const priceDiff = totalPrice - existingPurchase.totalPrice;

            console.log(priceDiff);

            await BalanceModel.findOneAndUpdate(
                {},
                {
                    $inc: {
                        balance: -priceDiff,
                        expense: priceDiff,
                    },
                    $set: {
                        date: new Date(),
                    },
                }
            );
        }

        const updatedPurchase = await FeedPurchaseModel.findByIdAndUpdate(
            id,
            {
                feedType,
                quantityPurchased,
                perKgPrice,
                totalPrice,
                paymentType,
            },
            { new: true }
        );

        return NextResponse.json(
            {
                message: 'Feed purchase updated successfully',
                purchase: updatedPurchase,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: 'Error updating feed purchase', error },
            { status: 500 }
        );
    }
}
