export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import MilkProductionModel from '@/models/milk.production.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await dbConfig();

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get('search')?.trim() || '';

        const skip = (page - 1) * limit;

        let searchQuery = {};

        if (search) {
            const numericSearch = Number(search);

            searchQuery = {
                $or: [
                    isNaN(numericSearch)
                        ? { time: { $regex: search, $options: 'i' } }
                        : { totalMilkQuantity: numericSearch },
                    isNaN(numericSearch)
                        ? {}
                        : { fatPercentage: numericSearch },
                ],
            };
        }

        const totalItems = await MilkProductionModel.countDocuments(
            searchQuery
        );

        const milkProductions = await MilkProductionModel.find(searchQuery)
            .skip(skip)
            .limit(limit)
            .lean()
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json(
            {
                success: true,
                data: milkProductions,
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
        return NextResponse.json(
            { message: (error as Error).message },
            { status: 500 }
        );
    }
}
