import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export default async function extractDataFromToken(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value || '';

        const decodedToken = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as jwt.JwtPayload;

        return decodedToken.id;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}
