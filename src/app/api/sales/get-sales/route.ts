export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import SalesModel from '@/models/sales.model';
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
            const numericSearch = parseFloat(search);

            if (!isNaN(numericSearch)) {
                query = {
                    $or: [
                        {
                            buyersPhoneNumber: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        { paymentMethod: { $regex: search, $options: 'i' } },
                        { salesType: { $regex: search, $options: 'i' } },
                        { perLiterPrice: numericSearch },
                        { totalPrice: numericSearch },
                        { milkQuantity: numericSearch },
                    ],
                };
            } else {
                query = {
                    $or: [
                        {
                            buyersPhoneNumber: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        { paymentMethod: { $regex: search, $options: 'i' } },
                        { salesType: { $regex: search, $options: 'i' } },
                    ],
                };
            }
        }

        const sales = await SalesModel.find(query).skip(skip).limit(limit);
        const total = await SalesModel.countDocuments(query);

        return NextResponse.json(
            {
                data: sales,
                total: total,
                success: true,
                message: 'Data fetched successfully',
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching data',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
