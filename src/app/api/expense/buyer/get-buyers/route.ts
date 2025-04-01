import dbConfig from '@/lib/dbConfig';
import { BuyerModel } from '@/models/expense.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await BuyerModel.find();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No data found!',
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved the data.',
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
                message: 'An error occurred while retrieving the data.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
