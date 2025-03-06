import dbConfig from '@/lib/dbConfig';
import FeedingModel from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ID is required',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const data = await FeedingModel.findByIdAndDelete(id);

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
                message: 'Feeding deleted successfully',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            {
                status: 500,
            }
        );
    }
}
