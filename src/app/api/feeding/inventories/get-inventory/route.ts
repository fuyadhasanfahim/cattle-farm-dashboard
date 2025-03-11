import dbConfig from '@/lib/dbConfig';
import { FeedInventoryModel } from '@/models/feeding.model';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConfig();

        const inventory = await FeedInventoryModel.find({});

        return NextResponse.json({ inventory }, { status: 200 });
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
