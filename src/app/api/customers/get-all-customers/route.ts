export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import CustomerModel from '@/models/customer.model';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { mobileNumber: { $regex: search, $options: 'i' } },
                    { customerType: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const customers = await CustomerModel.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await CustomerModel.countDocuments(query);

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved data.',
                data: customers,
                total: total,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || 'An error occurred',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
