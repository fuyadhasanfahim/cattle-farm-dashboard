export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const mobileNumber = searchParams.get('mobile_number');

        if (!mobileNumber) {
            return NextResponse.json({
                success: false,
                message: 'Mobile number not found',
            });
        }

        await dbConfig();

        const customer = await CustomerModel.findOne({ mobileNumber });

        if (!customer) {
            return NextResponse.json({
                success: false,
                message: 'Customer not found',
            });
        }

        return NextResponse.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: (error as Error).message,
        });
    }
}
