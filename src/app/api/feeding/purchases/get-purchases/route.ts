import dbConfig from '@/lib/dbConfig';
import { FeedPurchaseModel, FeedInventoryModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.nextUrl);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get('search') || '';

        const feedPurchasesQuery = search
            ? {
                  $or: [
                      { purchaseName: { $regex: search, $options: 'i' } },
                      { feedType: { $regex: search, $options: 'i' } },
                      { paymentType: { $regex: search, $options: 'i' } },
                      {
                          perKgPrice: isNaN(Number(search))
                              ? { $regex: search, $options: 'i' }
                              : Number(search),
                      },
                      {
                          purchaseDate: isNaN(Number(search))
                              ? { $regex: search, $options: 'i' }
                              : new Date(Number(search)),
                      },
                      {
                          totalPrice: isNaN(Number(search))
                              ? { $regex: search, $options: 'i' }
                              : Number(search),
                      },
                      {
                          quantityPurchased: isNaN(Number(search))
                              ? { $regex: search, $options: 'i' }
                              : Number(search),
                      },
                  ],
              }
            : {};

        const feedPurchases = await FeedPurchaseModel.find(feedPurchasesQuery)
            .sort({ purchaseDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        await FeedInventoryModel.find();

        const totalFeedPurchases = await FeedPurchaseModel.countDocuments(
            feedPurchasesQuery
        );

        return NextResponse.json(
            {
                success: true,
                feedPurchases,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(Math.max(totalFeedPurchases) / limit),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch feed data',
                error,
            },
            { status: 500 }
        );
    }
}
