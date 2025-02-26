import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const cattleTagId = await CattleModel.find();

        return NextResponse.json(
            {
                success: true,
                message: 'Cattle tags fetched successfully',
                data: cattleTagId,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message ||
                    'An error occurred while getting information.',
            },
            { status: 500 }
        );
    }
}
