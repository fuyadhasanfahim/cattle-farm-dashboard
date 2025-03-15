import dbConfig from '@/lib/dbConfig';
import { FeedingLogModel } from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await dbConfig();

        const { searchParams } = new URL(req.nextUrl);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const search = searchParams.get('search') || '';

        const feedLogsQuery = search
            ? {
                  $or: [
                      { cattleId: { $regex: search, $options: 'i' } },
                      { feedType: { $regex: search, $options: 'i' } },
                      {
                          $expr: {
                              $regexMatch: {
                                  input: { $toString: '$feedAmount' },
                                  regex: search,
                                  options: 'i',
                              },
                          },
                      },
                  ],
              }
            : {};

        const data = await FeedingLogModel.find(feedLogsQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalFeedLogs = await FeedingLogModel.countDocuments(
            feedLogsQuery
        );

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No data found!',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Feeding logs retrieved successfully.',
                data,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(Math.max(totalFeedLogs) / limit),
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'An error occurred while processing the request',
            errorMessage: (error as Error).message,
        });
    }
}
