import dbConfig from '@/lib/dbConfig';
import { PurchaseModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);
        const id = searchParams.get('id');

        const data = await req.json();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide data!',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const updatedData = await PurchaseModel.findByIdAndUpdate(id, data);

        if (!updatedData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Purchase not found.',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Purchase updated successfully.',
                data: updatedData,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while updating the purchase.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
