export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import SalesModel from '@/models/sales.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const id = searchParams.get('id');

        await dbConfig();

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Invalid id provided.',
            });
        }

        const data = await SalesModel.findById(id);

        if (!data) {
            return NextResponse.json({
                success: false,
                message: 'Sales not found.',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Data retrieved successfully.',
            data,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: (error as Error).message || 'Something went wrong!',
            error,
        });
    }
}
