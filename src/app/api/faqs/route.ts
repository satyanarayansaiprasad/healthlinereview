import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const faqs = await prisma.faq.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(faqs);
    } catch (error) {
        console.error('FAQs fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { question, answer, order, isActive } = body;

        const faq = await prisma.faq.create({
            data: {
                question,
                answer,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(faq);
    } catch (error) {
        console.error('FAQ creation error:', error);
        return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, question, answer, order, isActive } = body;

        const faq = await prisma.faq.update({
            where: { id },
            data: {
                question,
                answer,
                order,
                isActive,
            },
        });

        return NextResponse.json(faq);
    } catch (error) {
        console.error('FAQ update error:', error);
        return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
        }

        await prisma.faq.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('FAQ deletion error:', error);
        return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
    }
}
