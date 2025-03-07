import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const publicRoutes = ['/login', '/signup'];
    const token = req.cookies.get('token')?.value || '';

    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
