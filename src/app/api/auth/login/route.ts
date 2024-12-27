import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    try {
        await dbConnect();

        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User does not exist.' },
                { status: 404 }
            );
        }

        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                { success: false, message: 'Invalid password.' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Login successful.',
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message || 'Internal server error.',
            },
            { status: 500 }
        );
    }
}
