import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
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

        const totalPrice = existingPurchase.totalPrice;

        const balance = await BalanceModel.find();

        const totalBalance = balance.reduce(
            (acc, item) => acc + item.balance,
            0
        );

        await BalanceModel.findOneAndUpdate(
            {},
            {
                $set: { balance: totalBalance + totalPrice },
                $inc: { expense: -totalPrice },
                date: new Date(),
            },
            { new: true, upsert: true }
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
