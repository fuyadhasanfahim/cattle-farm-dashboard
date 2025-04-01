import dbConfig from '@/lib/dbConfig';
import { PurchaseModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.nextUrl);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchQuery: any = {};

        if (search) {
            searchQuery.$or = [
                { sellerName: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { itemName: { $regex: search, $options: 'i' } },
                { paymentStatus: { $regex: search, $options: 'i' } },
            ];

            const searchNumber = Number(search);
            if (!isNaN(searchNumber)) {
                searchQuery.$or.push(
                    { quantity: searchNumber },
                    { price: searchNumber },
                    { paymentAmount: searchNumber },
                    { dueAmount: searchNumber }
                );
            }
        }

        const totalItems = await PurchaseModel.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalItems / limit);

        const data = await PurchaseModel.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .lean()
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                message: 'Data retrieved successfully',
                data,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('GET API Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error.',
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
