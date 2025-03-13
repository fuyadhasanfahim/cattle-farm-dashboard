import { NextRequest, NextResponse } from 'next/server';
import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel, FeedInventoryModel } from '@/models/feeding.model';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await dbConfig();

        const { cattleId, feedType, feedAmount, feedingMethod, feedDate } =
            await req.json();

        const inventory = await FeedInventoryModel.findOne({ feedType });

        if (!inventory || inventory.totalStock < feedAmount) {
            return NextResponse.json(
                { error: 'Not enough feed stock available' },
                { status: 400 }
            );
        }

        const newLog = await FeedingLogModel.create({
            cattleId,
            feedType,
            feedAmount,
            feedingMethod,
            feedDate,
        });

        const updatedInventory = await FeedInventoryModel.findOneAndUpdate(
            { feedType },
            { $inc: { totalStock: -feedAmount }, lastUpdated: new Date() },
            { new: true }
        );

        return NextResponse.json(
            {
                message: 'Feeding log added',
                log: newLog,
                inventory: updatedInventory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
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
