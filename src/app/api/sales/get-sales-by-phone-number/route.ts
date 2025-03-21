export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConfig from '@/lib/dbConfig';
import SalesModel from '@/models/sales.model';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.url);
        const phoneNumber = searchParams.get('phoneNumber');

        if (!phoneNumber) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        const sales = await SalesModel.find({ buyersPhoneNumber: phoneNumber });

        if (!sales || sales.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No sales found for the given phone number',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: sales,
                message: 'Sales fetched successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error,
            },
            { status: 500 }
        );
    }
}
