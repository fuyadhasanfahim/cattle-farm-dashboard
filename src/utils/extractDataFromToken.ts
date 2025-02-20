import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export default async function extractDataFromToken(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return null;
        }

        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as jwt.JwtPayload;

        return decodedToken?.id || null;
    } catch (error) {
        console.log('🚨 JWT Verification Failed:', (error as Error).message);
        return null;
    }
}
