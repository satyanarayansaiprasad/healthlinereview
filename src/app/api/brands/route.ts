import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get('limit');
        const starredOnly = searchParams.get('starredOnly') === 'true';
        const search = searchParams.get('search');
        const letter = searchParams.get('letter');

        const where: any = {};

        if (starredOnly) {
            where.isStarred = true;
        }

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive',
            };
        }

        if (letter) {
            where.name = {
                startsWith: letter,
                mode: 'insensitive',
            };
        }

        const brands = await prisma.brand.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: limit ? parseInt(limit) : undefined,
        });

        return NextResponse.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, logoUrl } = await req.json();

        if (!name || !logoUrl) {
            return NextResponse.json({ error: 'Name and logo URL are required' }, { status: 400 });
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                logoUrl,
            },
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error('Error creating brand:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
