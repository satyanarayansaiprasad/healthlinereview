import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { isStarred, name, logoUrl } = await req.json();
        const { id } = await params;

        const brand = await prisma.brand.update({
            where: { id },
            data: {
                isStarred,
                name,
                logoUrl,
            },
        });

        return NextResponse.json(brand);
    } catch (error) {
        console.error('Error updating brand:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.brand.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Error deleting brand:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
