import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.reviewCategory.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Categories fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, imageUrl, isStarred } = body;

        if (!name || !imageUrl) {
            return NextResponse.json({ error: 'Name and Image are required' }, { status: 400 });
        }

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const category = await prisma.reviewCategory.create({
            data: {
                name,
                slug,
                imageUrl,
                isStarred: isStarred || false,
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error('Category creation error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, name, imageUrl, isStarred } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const data: any = {};
        if (name) {
            data.name = name;
            data.slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        if (imageUrl) data.imageUrl = imageUrl;
        if (isStarred !== undefined) data.isStarred = isStarred;

        const category = await prisma.reviewCategory.update({
            where: { id },
            data,
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Category update error:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await prisma.reviewCategory.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Category deletion error:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
