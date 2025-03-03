import FeedingModel from '@/models/feeding.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { খাদ্যের_ধরণ, খাদ্যের_পরিমাণ, তারিখ } = await request.json();

        if (!খাদ্যের_ধরণ || !খাদ্যের_পরিমাণ || !তারিখ) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'All fields are required',
                },
                {
                    status: 400,
                }
            );
        }

        const data = new FeedingModel({ খাদ্যের_ধরণ, খাদ্যের_পরিমাণ, তারিখ });

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully Created',
                data,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred',
            },
            {
                status: 500,
            }
        );
    }
}
