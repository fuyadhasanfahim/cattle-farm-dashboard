import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './lib/sessions';

const protectedRoutes = ['/'];
const publicRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = req.cookies.get('session')?.value;
    const session = cookie ? await decrypt(cookie) : null;

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}
