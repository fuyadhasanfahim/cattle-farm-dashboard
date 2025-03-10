import dbConfig from '@/lib/dbConfig';
import TreatmentModel from '@/models/treatment.model';
import { NextRequest, NextResponse } from 'next/server';
import { SortOrder } from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.nextUrl);

        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const skip = (page - 1) * limit;

        const sort = searchParams.get('sort') || 'createdAt';
        const sortOrder: SortOrder = 'desc';
        const sortQuery: { [key: string]: SortOrder } = {
            [sort]: sortOrder,
        };

        const search = searchParams.get('search');
        const searchQuery = search
            ? { medicineName: { $regex: search, $options: 'i' } }
            : {};

        await dbConfig();

        const data = await TreatmentModel.find(searchQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const totalRecords = await TreatmentModel.countDocuments(searchQuery);

        return NextResponse.json({
            success: true,
            message: 'Data retrieved successfully',
            data,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: page,
            totalRecords,
            limit,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while processing the request',
                error,
            },
            { status: 500 }
        );
    }
}
