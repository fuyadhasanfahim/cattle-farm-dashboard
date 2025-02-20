import dbConfig from '@/lib/dbConfig';
import UserModel from '@/models/user.model';
import extractDataFromToken from '@/utils/extractDataFromToken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        await dbConfig();

        const userId = await extractDataFromToken(request);
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired token',
                },
                {
                    status: 401,
                }
            );
        }

        const user = await UserModel.findById(userId).select('-password');
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
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
