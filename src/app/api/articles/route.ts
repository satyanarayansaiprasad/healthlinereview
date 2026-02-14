import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const categoryId = searchParams.get('categoryId');

    try {
        const articles = await prisma.article.findMany({
            where: {
                ...(status ? { status: status as any } : {}),
                ...(categoryId ? { categoryId } : {}),
            },
            include: {
                category: true,
                author: {
                    select: { name: true, email: true }
                },
                tags: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, slug, content, categoryId, featuredImage, status, tags } = await req.json();

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                featuredImage,
                status,
                categoryId,
                authorId: decoded.userId,
                tags: {
                    connectOrCreate: tags.map((name: string) => ({
                        where: { name },
                        create: { name, slug: name.toLowerCase().replace(/ /g, '-') }
                    }))
                }
            }
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error('Article creation error:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
