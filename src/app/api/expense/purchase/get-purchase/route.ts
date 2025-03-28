import { PurchaseModel } from '@/models/expense.model';
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

        const data = await PurchaseModel.findById(id);

        if (!data) {
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
                message: 'Purchase successfully retrieved.',
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
                message: 'Something went wrong!',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
