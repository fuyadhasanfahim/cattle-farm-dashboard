import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel, FeedInventoryModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Invalid ID.' },
                { status: 400 }
            );
        }

        const data = await req.json();
        const { feedAmount, feedType } = data;

        if (!feedAmount || !feedType) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        await dbConfig();

        const existingLog = await FeedingLogModel.findById(id);

        if (!existingLog) {
            return NextResponse.json(
                { success: false, message: 'Feeding log not found.' },
                { status: 404 }
            );
        }

        const previousFeedAmount = existingLog.feedAmount || 0;
        const quantityDiff = feedAmount - previousFeedAmount;

        if (quantityDiff !== 0) {
            await FeedInventoryModel.findOneAndUpdate(
                { feedType },
                { $inc: { totalStock: -quantityDiff }, lastUpdated: new Date() }
            );
        }

        const updatedLog = await FeedingLogModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Feeding log updated successfully.',
                data: updatedLog,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error.', error },
            { status: 500 }
        );
    }
}
