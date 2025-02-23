import { NextRequest, NextResponse } from 'next/server';
import Cattle from '@/models/cattle.model';
import dbConfig from '@/lib/dbConfig';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
            .lean();

        const transformedData = cattles.map((cattle, index) => ({
            _id: cattle._id!.toString(),
            'ক্রমিক নং': (skip + index + 1).toString(),
            'ট্যাগ আইডি': cattle.cattleId,
            'রেজিষ্ট্রেশন তাং': new Date(
                cattle.registrationDate
            ).toLocaleDateString('bn-BD'),
            'বয়স/মাস': cattle.age,
            'স্টল নাং': cattle.stallNo,
            'ওজন/কেজি': cattle.weight,
            'গবাদিপশুর লিঙ্গ': cattle.gender,
            'মোটাতাজা করন স্ট্যাটাস': cattle.fatteningStatus,
            'গবাদিপশুর ধরন': cattle.cattleType,
            'গবাদিপশুর ক্যাটাগরি': cattle.category,
            'স্থানান্তর/বিক্রয়': cattle.transferStatus,
            'মৃত অবস্থা': cattle.deathStatus,
            'বিবরন': cattle.description,
        }));

        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json(
            {
                success: true,
                data: transformedData,
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
