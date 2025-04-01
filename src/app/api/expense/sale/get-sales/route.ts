export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import { SaleModel } from '@/models/expense.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
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
                            buyerName: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        { category: { $regex: search, $options: 'i' } },
                        { pricePerItem: numericSearch },
                        { price: numericSearch },
                        { quantity: numericSearch },
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

        await dbConfig();

        const data = await SaleModel.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await SaleModel.countDocuments(query);

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No sales found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully fetched all sales',
                data,
                total,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching sales',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
