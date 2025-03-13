import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or missing id parameter.',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const log = await FeedingLogModel.findById(id);

        if (!log) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Feeding log not found.',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Feeding log fetched successfully.',
                data: log,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching the feeding log.',
                error: (error as Error).message,
            },
            {
                status: 500,
            }
        );
    }
}
