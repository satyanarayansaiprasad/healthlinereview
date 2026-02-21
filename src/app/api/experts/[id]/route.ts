import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { id } = await params;

        const expert = await prisma.healthExpert.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(expert);
    } catch (error) {
        console.error('Error updating expert:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.healthExpert.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Expert deleted successfully' });
    } catch (error) {
        console.error('Error deleting expert:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
