export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import { BuyerModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid request body',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const data = new BuyerModel(body);

        await data.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Seller added successfully',
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to the database',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
