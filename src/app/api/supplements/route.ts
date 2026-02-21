import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const featured = searchParams.get('featured');
        const search = searchParams.get('search');
        const char = searchParams.get('char'); // A-Z, 0-9

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { subtitle: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (char) {
            if (/^[0-9]$/.test(char)) {
                where.title = { startsWith: char };
            } else {
                where.title = { startsWith: char, mode: 'insensitive' };
            }
        }

        const supplements = await prisma.supplement.findMany({
            where,
            include: {
                author: true
            },
            orderBy: [
                { rank: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(supplements);
    } catch (error) {
        console.error('Error fetching supplements:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            title,
            slug,
            subtitle,
            content,
            featuredImage,
            authorId,
            faqs,
            conclusion,
            sources,
            metaTitle,
            metaDescription,
            isHelpfulActive,
            rank
        } = body;

        if (!title || !slug || !authorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supplement = await prisma.supplement.create({
            data: {
                title,
                slug,
                subtitle,
                content: content || {},
                featuredImage,
                authorId,
                faqs: faqs || [],
                conclusion,
                sources: sources || [],
                metaTitle,
                metaDescription,
                isHelpfulActive: isHelpfulActive !== undefined ? isHelpfulActive : true,
                rank: rank || 0
            }
        });

        return NextResponse.json(supplement);
    } catch (error) {
        console.error('Error creating supplement:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
