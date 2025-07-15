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

        const sortField = searchParams.get('sort') || 'createdAt';
        const sortOrder: SortOrder =
            (searchParams.get('sortOrder') as SortOrder) || 'desc';

        const sortQuery: { [key: string]: SortOrder } = {
            [sortField]: sortOrder,
        };

        const search = searchParams.get('search');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let searchQuery: any = {};

        if (search) {
            const isNumber = !isNaN(Number(search));

            searchQuery = {
                $or: [
                    { treatmentType: { $regex: search, $options: 'i' } },
                    { medicineName: { $regex: search, $options: 'i' } },
                    { medicineAmount: { $regex: search, $options: 'i' } },
                    { medicineReason: { $regex: search, $options: 'i' } },
                    { cattleId: { $regex: search, $options: 'i' } }, // Added cattleId to search
                ],
            };

            // Only add numeric field searches if the search term is actually a number
            if (isNumber) {
                searchQuery.$or.push(
                    { vaccinationInterval: Number(search) },
                    { dewormingCount: Number(search) },
                    { vaccinationCount: Number(search) },
                    { generalCount: Number(search) }
                );
            }
        }

        await dbConfig();

        const data = await TreatmentModel.find(searchQuery)
            .sort(sortQuery || { createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await TreatmentModel.countDocuments(searchQuery);

        return NextResponse.json({
            success: true,
            message: 'Data retrieved successfully',
            data,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while processing the request',
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
