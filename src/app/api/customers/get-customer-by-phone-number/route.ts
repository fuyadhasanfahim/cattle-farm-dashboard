export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const মোবাইল_নম্বর = searchParams.get('mobile_number');

        if (!মোবাইল_নম্বর) {
            return NextResponse.json({
                success: false,
                message: 'Mobile number not found',
            });
        }

        await dbConfig();

        const customer = await CustomerModel.findOne({ মোবাইল_নম্বর });

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
