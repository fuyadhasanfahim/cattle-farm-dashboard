import dbConfig from '@/lib/dbConfig';
import UserModel from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Token is required',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const user = await UserModel.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired token',
                },
                {
                    status: 400,
                }
            );
        }

        user.isVerified = true;
        user.verifyToken = null;
        user.verifyTokenExpiry = null;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Email verified successfully',
            },
            {
                status: 200,
            }
        );
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
