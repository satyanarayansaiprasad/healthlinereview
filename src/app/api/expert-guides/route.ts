import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const guide = await (prisma as any).expertPicksGuide.findUnique({
                where: { slug },
                include: {
                    category: true,
                    author: {
                        select: { name: true, id: true }
                    },
                    medicalReviewer: {
                        select: { name: true, imageUrl: true, designation: true }
                    },
                    products: {
                        orderBy: { rank: 'asc' }
                    }
                }
            });

            if (!guide) {
                return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
            }
            return NextResponse.json(guide);
        }

        const guides = await (prisma as any).expertPicksGuide.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                category: {
                    select: { name: true, slug: true }
                },
                author: {
                    select: { name: true }
                },
                _count: {
                    select: { products: true }
                }
            }
        });

        return NextResponse.json(guides);
    } catch (error: any) {
        console.error('Error fetching guides:', error);
        return NextResponse.json({ error: 'Failed to fetch guides', details: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const user = await verifyToken(token);
        if (!user || user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Required fields check
        if (!data.title || !data.slug || !data.authorId) {
             return NextResponse.json({ error: 'Missing required fields: title, slug, authorId' }, { status: 400 });
        }

        // Create the Guide and its Products in a transaction
        const guide = await (prisma as any).$transaction(async (tx: any) => {
            const newGuide = await tx.expertPicksGuide.create({
                data: {
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    howWeRanked: data.howWeRanked || [],
                    ingredientsAnalysis: data.ingredientsAnalysis || [],
                    buyingGuide: data.buyingGuide || [],
                    faqs: data.faqs || [],
                    finalVerdict: data.finalVerdict,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    authorId: data.authorId,
                    medicalReviewerId: data.medicalReviewerId,
                    categoryId: data.categoryId,
                }
            });

            if (data.products && Array.isArray(data.products) && data.products.length > 0) {
                await tx.expertPickProduct.createMany({
                    data: data.products.map((p: any, index: number) => ({
                        guideId: newGuide.id,
                        rank: p.rank || (index + 1),
                        productName: p.productName,
                        shortHighlight: p.shortHighlight,
                        rating: parseFloat(p.rating || '0'),
                        award: p.award,
                        pros: p.pros || [],
                        cons: p.cons || [],
                        price: p.price,
                        buyLink: p.buyLink,
                        highlights: p.highlights || [],
                        productImage: p.productImage,
                    }))
                });
            }

            return newGuide;
        });

        return NextResponse.json(guide);
    } catch (error: any) {
        console.error('Error creating guide:', error);
        if (error.code === 'P2002') {
             return NextResponse.json({ error: 'A guide with this slug already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create guide', details: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const user = await verifyToken(token);
        if (!user || user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        
        if (!data.id) {
             return NextResponse.json({ error: 'Guide ID is required' }, { status: 400 });
        }

        const guide = await (prisma as any).$transaction(async (tx: any) => {
            // Update the main guide
            const updatedGuide = await tx.expertPicksGuide.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    howWeRanked: data.howWeRanked,
                    ingredientsAnalysis: data.ingredientsAnalysis,
                    buyingGuide: data.buyingGuide,
                    faqs: data.faqs,
                    finalVerdict: data.finalVerdict,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    authorId: data.authorId,
                    medicalReviewerId: data.medicalReviewerId,
                    categoryId: data.categoryId,
                }
            });

            // Handle nested products (delete existing and recreate is easiest for complex updates)
            if (data.products && Array.isArray(data.products)) {
                await tx.expertPickProduct.deleteMany({
                    where: { guideId: data.id }
                });

                if (data.products.length > 0) {
                    await tx.expertPickProduct.createMany({
                        data: data.products.map((p: any, index: number) => ({
                            guideId: updatedGuide.id,
                            rank: p.rank || (index + 1),
                            productName: p.productName,
                            shortHighlight: p.shortHighlight,
                            rating: parseFloat(p.rating || '0'),
                            award: p.award,
                            pros: p.pros || [],
                            cons: p.cons || [],
                            price: p.price,
                            buyLink: p.buyLink,
                            highlights: p.highlights || [],
                            productImage: p.productImage,
                        }))
                    });
                }
            }

            return updatedGuide;
        });

        return NextResponse.json(guide);
    } catch (error: any) {
        console.error('Error updating guide:', error);
        if (error.code === 'P2002') {
             return NextResponse.json({ error: 'A guide with this slug already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update guide', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const user = await verifyToken(token);
        if (!user || user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Guide ID is required' }, { status: 400 });
        }

        // OnDelete Cascade in Prisma schema handles the related products
        await (prisma as any).expertPicksGuide.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting guide:', error);
        return NextResponse.json({ error: 'Failed to delete guide', details: error.message }, { status: 500 });
    }
}
