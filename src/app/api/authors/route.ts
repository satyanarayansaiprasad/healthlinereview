import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const user = await verifyToken(token);
        if (!user || user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all users who can be authors (all roles for now in admin)
        const authors = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                role: true,
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json(authors);
    } catch (error: any) {
        console.error('Error fetching authors:', error);
        return NextResponse.json({ error: 'Failed to fetch authors', details: error.message }, { status: 500 });
    }
}
