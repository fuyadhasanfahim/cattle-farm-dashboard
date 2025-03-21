import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');

        const date = dateParam ? new Date(dateParam) : new Date();

        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const data = await MilkProductionModel.find({
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        const todaysMilkAmount = data.reduce(
            (acc, curr) => acc + (curr.saleMilkAmount || 0),
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
                error,
            },
            { status: 500 }
        );
    }
}
