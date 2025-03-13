import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel } from '@/models/feeding.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await FeedingLogModel.find().sort('-createdAt');

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No data found!',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Feeding logs retrieved successfully.',
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while processing the request',
            errorMessage: (error as Error).message,
        });
    }
}
