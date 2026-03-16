import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supplement = await prisma.supplement.findUnique({
            where: { id },
            include: { author: true }
        });

        if (!supplement) {
            return NextResponse.json({ error: 'Supplement not found' }, { status: 404 });
        }

        return NextResponse.json(supplement);
    } catch (error) {
        console.error('Error fetching supplement:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();

        const supplement = await prisma.supplement.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(supplement);
    } catch (error) {
        console.error('Error updating supplement:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.supplement.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Supplement deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplement:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
