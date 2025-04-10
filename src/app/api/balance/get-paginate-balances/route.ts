import dbConfig from '@/lib/dbConfig';
import BalanceModel from '@/models/balance.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '10');
        const page = parseInt(searchParams.get('page') || '1');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (search) {
            if (!isNaN(Number(search))) {
                query.$or = [
                    { balance: Number(search) },
                    { earning: Number(search) },
                    { expense: Number(search) },
                    { due: Number(search) },
                    { description: search },
                ];
            }
        }

        const totalDocuments = await BalanceModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);
        const skip = (page - 1) * limit;

        const balances = await BalanceModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: balances,
            pagination: {
                totalPages,
                currentPage: page,
                totalItems: totalDocuments,
                limit,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch balance data',
                error,
            },
            { status: 500 }
        );
    }
}
