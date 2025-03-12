import { NextRequest, NextResponse } from 'next/server';
import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel, FeedInventoryModel } from '@/models/feeding.model';

export async function POST(req: NextRequest) {
    try {
        await dbConfig();

        const { cattleId, feedType, feedAmount, feedingMethod } =
            await req.json();

        const newLog = await FeedingLogModel.create({
            cattleId,
            feedType,
            feedAmount,
            feedingMethod,
        });

        const inventory = await FeedInventoryModel.findOneAndUpdate(
            { feedType },
            { $inc: { totalStock: -feedAmount }, lastUpdated: new Date() },
            { new: true }
        );

        if (!inventory || inventory.totalStock < 0) {
            return NextResponse.json(
                { error: 'Not enough feed stock available' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Feeding log added', log: newLog, inventory },
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
