import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthToken } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const review = await (prisma as any).productReview.findUnique({
                where: { slug },
                include: {
                    author: { select: { name: true, id: true } },
                    medicalReviewer: { select: { name: true, imageUrl: true, designation: true } },
                    category: { select: { name: true, slug: true } }
                }
            });

            if (!review) {
                return NextResponse.json({ error: 'Review not found' }, { status: 404 });
            }
            return NextResponse.json(review);
        }

        const reviews = await (prisma as any).productReview.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                category: {
                    select: { name: true, slug: true }
                },
                author: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json(reviews);
    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
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
        const {
            productName, slug, verdict, brand, form, price, guarantee, sideEffects,
            description, targetAudience, workingMechanism, safetyInfo, warnings,
            recommendation, affiliateLink, featuredImage, content, metaTitle,
            metaDescription, authorId, categoryId, medicalReviewerId
        } = data;

        // Required fields check based on the new schema
        if (!productName || !slug || !authorId) {
             return NextResponse.json({ error: 'Missing required fields: productName, slug, authorId' }, { status: 400 });
        }

        const review = await (prisma as any).productReview.create({
            data: {
                productName,
                slug,
                rating: parseFloat(data.rating || '0'),
                verdict,
                pros: data.pros || [],
                cons: data.cons || [],
                ingredients: data.ingredients || [],
                brand,
                form,
                price,
                guarantee,
                sideEffects,
                description,
                targetAudience,
                workingMechanism,
                safetyInfo,
                warnings,
                detailedIngredients: data.detailedIngredients || [],
                benefitsList: data.benefitsList || [],
                customerReviews: data.customerReviews || [],
                pricingOffers: data.pricingOffers || [],
                faqs: data.faqs || [],
                finalRating: data.finalRating ? parseFloat(data.finalRating) : null,
                recommendation,
                affiliateLink,
                featuredImage,
                content,
                metaTitle,
                metaDescription,
                authorId,
                categoryId,
                medicalReviewerId,
            }
        });

        return NextResponse.json(review);
    } catch (error: any) {
        console.error('Error creating review:', error);
        // Prisma unique constraint error code
        if (error.code === 'P2002') {
             return NextResponse.json({ error: 'A review with this slug already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create review', details: error.message }, { status: 500 });
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
        const {
            id, productName, slug, verdict, brand, form, price, guarantee, sideEffects,
            description, targetAudience, workingMechanism, safetyInfo, warnings,
            recommendation, affiliateLink, featuredImage, content, metaTitle,
            metaDescription, categoryId, medicalReviewerId
        } = data;
        
        if (!id) {
             return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        const review = await (prisma as any).productReview.update({
            where: { id },
            data: {
                productName,
                slug,
                rating: data.rating !== undefined ? parseFloat(data.rating) : undefined,
                verdict,
                pros: data.pros,
                cons: data.cons,
                ingredients: data.ingredients,
                brand,
                form,
                price,
                guarantee,
                sideEffects,
                description,
                targetAudience,
                workingMechanism,
                safetyInfo,
                warnings,
                detailedIngredients: data.detailedIngredients,
                benefitsList: data.benefitsList,
                customerReviews: data.customerReviews,
                pricingOffers: data.pricingOffers,
                faqs: data.faqs,
                finalRating: data.finalRating !== undefined ? parseFloat(data.finalRating) : undefined,
                recommendation,
                affiliateLink,
                featuredImage,
                content,
                metaTitle,
                metaDescription,
                categoryId,
                medicalReviewerId,
            }
        });

        return NextResponse.json(review);
    } catch (error: any) {
        console.error('Error updating review:', error);
        if (error.code === 'P2002') {
             return NextResponse.json({ error: 'A review with this slug already exists.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update review', details: error.message }, { status: 500 });
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
            return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
        }

        await (prisma as any).productReview.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review', details: error.message }, { status: 500 });
    }
}
