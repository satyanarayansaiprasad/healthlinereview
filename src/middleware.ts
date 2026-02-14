import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Protect /admin routes
    if (path.startsWith('/admin')) {
        const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            if (path === '/admin/login') {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        // Role-based access control can be added here
        // For example, only SUPER_ADMIN can access user management
        if (path.startsWith('/admin/users') && decoded.role !== 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
