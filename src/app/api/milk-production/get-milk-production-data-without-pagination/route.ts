import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await MilkProductionModel.find();

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
                message: 'Successfully retrieved milk production data.',
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
