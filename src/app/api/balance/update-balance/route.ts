import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        await dbConfig();

        const data = await request.json();

        if (
            !data ||
            typeof data.balance !== 'number' ||
            typeof data.expense !== 'number' ||
            (data.due !== undefined && typeof data.due !== 'number')
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or missing required fields!',
                },
                { status: 400 }
            );
        }

        console.log(data);

        await BalanceModel.findOneAndUpdate(
            {},
            {
                $inc: {
                    balance: -data.balance,
                    expense: data.expense,
                    due: data.due || 0,
                },
                $set: { date: new Date() },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Balance updated successfully!',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error.', error },
            { status: 500 }
        );
    }
}
