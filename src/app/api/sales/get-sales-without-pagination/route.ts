export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import SalesModel from '@/models/sales.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await SalesModel.find().sort({ createdAt: -1 });

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No sales found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully fetched all sales',
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
