import dbConfig from '@/lib/dbConfig';
import MilkModel from '@/models/milk.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await MilkModel.findOne().sort('-createdAt');

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Data not found!',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching milk data:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while processing the request',
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
