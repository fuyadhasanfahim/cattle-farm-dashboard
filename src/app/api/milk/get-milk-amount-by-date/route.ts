export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');

        if (!dateParam) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Date parameter is required',
                },
                { status: 400 }
            );
        }

        const date = new Date(dateParam);

        date.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const data = await MilkProductionModel.find({
            milkCollectionDate: {
                $gte: date,
                $lte: endDate,
            },
        });

        if (data.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    data: 0,
                    message: 'No data found for this date',
                },
                { status: 200 }
            );
        }

        const todaysMilkAmount = data.reduce(
            (acc, curr) => acc + parseInt(curr.milkQuantity, 10),
            0
        );

        return NextResponse.json(
            {
                success: true,
                data: todaysMilkAmount,
                message: 'Data retrieved successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching data',
                error: error,
            },
            { status: 500 }
        );
    }
}
