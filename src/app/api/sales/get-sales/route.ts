export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import SalesModel from '@/models/sales.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const sales = await SalesModel.find();

        return NextResponse.json(
            {
                data: sales,
                success: true,
                message: 'Data fetched successfully',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching data',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
