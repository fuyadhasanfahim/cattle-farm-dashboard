import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UserModel from '@/models/user.model';
import dbConfig from '@/lib/dbConfig';

export async function GET(request: NextRequest) {
    try {
        await dbConfig();

        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1] || '';

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as jwt.JwtPayload;

        const userId = decodedToken.id;
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', error },
            { status: 500 }
        );
    }
}
