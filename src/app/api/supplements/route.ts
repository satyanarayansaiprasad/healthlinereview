import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
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
            title, slug, subtitle, content, featuredImage,
            authorId, faqs, conclusion, sources,
            metaTitle, metaDescription, isHelpfulActive, rank
        } = body;

        if (!title || !slug || !authorId) {
            return NextResponse.json({
                error: 'Missing required fields',
                fields: { title: !!title, slug: !!slug, authorId: !!authorId }
            }, { status: 400 });
        }

        const supplement = await prisma.supplement.create({
            data: {
                title,
                slug,
                subtitle: subtitle || null,
                content: content || {},
                featuredImage: featuredImage || null,
                authorId,
                faqs: faqs || [],
                conclusion: conclusion || null,
                sources: sources || [],
                metaTitle: metaTitle || null,
                metaDescription: metaDescription || null,
                isHelpfulActive: isHelpfulActive !== undefined ? isHelpfulActive : true,
                rank: rank ? Number(rank) : 0
            }
        });

        return NextResponse.json(supplement);
    } catch (error: any) {
        console.error('CRITICAL: Error creating supplement:', error);

        // Handle Prism-specific common errors
        if (error.code === 'P2002') {
            return NextResponse.json({
                error: 'A supplement with this slug already exists.',
                field: error.meta?.target
            }, { status: 400 });
        }

        if (error.code === 'P2003') {
            return NextResponse.json({
                error: 'Invalid author selected. Please choose a valid expert.',
                field: 'authorId'
            }, { status: 400 });
        }

        return NextResponse.json({
            error: 'Internal server error during DB save',
            details: error.message
        }, { status: 500 });
    }
}
