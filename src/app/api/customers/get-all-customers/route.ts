export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const result = await CustomerModel.find().sort('-createdAt');

        if (result.length === 0) {
            throw new Error('Customer not found');
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved data.',
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
                error,
            },
            {
                status: 500,
            }
        );
    }
}
