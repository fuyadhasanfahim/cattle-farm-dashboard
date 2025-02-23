import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid ID',
                },
                {
                    status: 404,
                }
            );
        }

        await dbConfig();

        const cattle = await CattleModel.findById(id);
        if (!cattle) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Cattle not found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            cattle,
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
