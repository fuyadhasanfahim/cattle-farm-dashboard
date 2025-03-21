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
        const sortOrder: SortOrder =
            (searchParams.get('sortOrder') as SortOrder) || 'desc';

        const sortQuery: { [key: string]: SortOrder } = {
            [sort]: sortOrder,
        };

        const search = searchParams.get('search');
        let searchQuery = {};

        if (search) {
            searchQuery = {
                $or: [
                    {
                        treatmentType: {
                            $regex: search,
                            $options: 'i',
                        },
                    },
                    { medicineName: { $regex: search, $options: 'i' } },
                    { medicineAmount: { $regex: search, $options: 'i' } },
                    { medicineReason: { $regex: search, $options: 'i' } },
                    {
                        vaccinationInterval: {
                            $regex: search,
                            $options: 'i',
                        },
                    },
                    { dewormingCount: { $regex: search, $options: 'i' } },
                    { vaccinationCount: { $regex: search, $options: 'i' } },
                    { generalCount: { $regex: search, $options: 'i' } },
                ],
            };
        }

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
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
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
