export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Cattle from '@/models/cattle.model';
import dbConfig from '@/lib/dbConfig';

export async function GET(request: NextRequest) {
    try {
        await dbConfig();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        const searchQuery = search
            ? {
                  $or: [
                      { cattleId: { $regex: search, $options: 'i' } },
                      { stallNo: { $regex: search, $options: 'i' } },
                      { cattleType: { $regex: search, $options: 'i' } },
                      { description: { $regex: search, $options: 'i' } },
                  ],
              }
            : {};

        const totalItems = await Cattle.countDocuments(searchQuery);

        const cattles = await Cattle.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .lean()
            .sort('-createdAt');

        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json(
            {
                success: true,
                data: cattles,
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
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message || 'Failed to fetch cattle data',
            },
            { status: 500 }
        );
    }
}
