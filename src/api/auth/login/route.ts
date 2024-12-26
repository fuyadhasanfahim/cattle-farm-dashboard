import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = (await req.json()) as {
            email: string;
            password: string;
        };

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Please enter both email and password.' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { error: 'Password not set for user.' },
                { status: 400 }
            );
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Wrong Password.' },
                { status: 404 }
            );
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json(
            { success: true, message: 'Logged in successfully.', user },
            { status: 200 }
        );

        response.cookies.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 24 * 60 * 60,
        });

        response.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error.', error },
            { status: 500 }
        );
    }
}
