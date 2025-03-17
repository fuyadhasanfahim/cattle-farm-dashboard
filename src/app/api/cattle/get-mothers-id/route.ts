export const dynamic = 'force-dynamic';

import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const mothers = await CattleModel.find({
            gender: 'Female',
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully getting the information',
                data: mothers,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch mothers',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
