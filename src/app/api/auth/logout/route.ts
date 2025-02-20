import dbConfig from '@/lib/dbConfig';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConfig();

        const response = NextResponse.json(
            {
                success: true,
                message: 'Logged out successfully',
            },
            {
                status: 200,
            }
        );

        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    (error as Error).message ||
                    'An error occurred while signing up',
                error,
            },
            {
                status: 500,
            }
        );
    }
}
