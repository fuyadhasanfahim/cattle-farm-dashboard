import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { FeedInventoryModel, FeedPurchaseModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
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

        let balance;
        let expense;
        let due;

        const totalPriceChanged = totalPrice !== existingPurchase.totalPrice;
        const paymentTypeChanged = paymentType !== existingPurchase.paymentType;

        if (totalPriceChanged || paymentTypeChanged) {
            const oldPaymentType = existingPurchase.paymentType;
            const oldTotalPrice = existingPurchase.totalPrice;
            const newTotalPrice = totalPrice;

            if (oldPaymentType === 'Paid') {
                if (paymentType === 'Paid') {
                    const priceDiff = newTotalPrice - oldTotalPrice;
                    balance = -priceDiff;
                    expense = priceDiff;
                } else {
                    balance = oldTotalPrice;
                    expense = -oldTotalPrice;
                    due = newTotalPrice;
                }
            } else {
                if (paymentType === 'Paid') {
                    balance = -newTotalPrice;
                    expense = newTotalPrice;
                    due = -oldTotalPrice;
                } else {
                    const priceDiff = newTotalPrice - oldTotalPrice;
                    due = priceDiff;
                }
            }

            await BalanceModel.create({
                balance,
                expense,
                due,
                description: `Feed purchase update for ${feedType}`,
                date: new Date(),
            });
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
