import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get('featured');

        const where: any = {};
        if (featured === 'true') {
            where.isFeatured = true;
        }

        const experts = await prisma.healthExpert.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(experts);
    } catch (error) {
        console.error('Error fetching experts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, designation, specializations, imageUrl, isFeatured } = body;

        if (!name || !designation || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const expert = await prisma.healthExpert.create({
            data: {
                name,
                designation,
                specializations: specializations || [],
                imageUrl,
                isFeatured: !!isFeatured,
            },
        });

        return NextResponse.json(expert);
    } catch (error) {
        console.error('Error creating expert:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
