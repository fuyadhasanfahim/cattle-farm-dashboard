import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConfig from '@/lib/dbConfig';
import UserModel from '@/models/user.model';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required',
                },
                {
                    status: 400,
                }
            );
        }

        await dbConfig();

        const user = await UserModel.findOne({ email });
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

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid password',
                },
                {
                    status: 400,
                }
            );
        }

        const tokenData = {
            id: user._id,
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!);

        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
            },
            {
                status: 200,
            }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return response;
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
