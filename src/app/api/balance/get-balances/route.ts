export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await BalanceModel.find();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No balance data found.',
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Balance data retrieved successfully',
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
                message: 'An error occurred while retrieving balance data.',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
