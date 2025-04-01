import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide a valid JSON payload!',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const newData = new BalanceModel(data);
        await newData.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Balance added successfully!',
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
