import dbConfig from '@/lib/dbConfig';
import FeedingModel from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid ID or id not specified!',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const data = await FeedingModel.findById(id);

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Feeding not found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Data retrieved successfully',
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Error retrieving data.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
