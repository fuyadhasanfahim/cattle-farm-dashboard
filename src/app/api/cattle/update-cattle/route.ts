import dbConfig from '@/lib/dbConfig';
import CattleModel from '@/models/cattle.model';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'ID is required',
                },
                {
                    status: 400,
                }
            );
        }

        const data = request.json();

        await dbConfig();

        const cattle = await CattleModel.findByIdAndUpdate(id, {
            $set: data,
        });
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

        return NextResponse.json(
            {
                success: true,
                message: 'Cattle updated successfully',
                cattle,
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
                    'An error occurred while updating cattle',
            },
            {
                status: 500,
            }
        );
    }
}
