import dbConfig from '@/lib/dbConfig';
import { SaleModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide a valid ID',
                },
                {
                    status: 400,
                }
            );
        }

        const saleData = await SaleModel.findById(id);

        if (!saleData) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No data found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Sale data retrieved successfully.',
                data: saleData,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
