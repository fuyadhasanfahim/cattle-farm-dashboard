import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel, FeedInventoryModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Invalid ID.' },
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

        const { feedAmount, feedType } = existingLog;

        await FeedingLogModel.findByIdAndDelete(id);

        await FeedInventoryModel.findOneAndUpdate(
            { feedType },
            { $inc: { totalStock: feedAmount }, lastUpdated: new Date() }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Feeding log deleted successfully.',
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
