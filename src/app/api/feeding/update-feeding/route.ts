import dbConfig from '@/lib/dbConfig';
import FeedingModel from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
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

        const data = await request.json();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Request body cannot be empty',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const updateData = await FeedingModel.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!updateData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Feeding record not found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Feeding record updated successfully',
                data: updateData,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || 'Internal Server Error',
            },
            {
                status: 500,
            }
        );
    }
}
