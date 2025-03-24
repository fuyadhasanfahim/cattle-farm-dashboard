import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const data = await CattleModel.find();

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No cattle data found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retrieved cattails data.',
                data,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || 'Something went wrong!',
            },
            {
                status: 500,
            }
        );
    }
}
