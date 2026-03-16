import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [
            totalBrands,
            totalReviews,
            totalTopics,
            totalSupplements,
            totalExperts,
            totalArticles
        ] = await Promise.all([
            prisma.brand.count(),
            prisma.productReview.count(),
            prisma.category.count(),
            prisma.supplement.count(),
            prisma.healthExpert.count(),
            prisma.article.count()
        ]);

        return NextResponse.json({
            brands: totalBrands,
            reviews: totalReviews,
            topics: totalTopics,
            supplements: totalSupplements,
            experts: totalExperts,
            articles: totalArticles
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
    }
}
