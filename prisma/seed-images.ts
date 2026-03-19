import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Enhancing Database with High-Quality Images ---');

    // 1. Update Review Categories with stunning Unsplash visuals
    const categoryImages: Record<string, string> = {
        'supplements': 'https://images.unsplash.com/photo-1471864190281-a93a3072467a?auto=format&fit=crop&q=80&w=800',
        'joint-pain': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800',
        'weight-loss': 'https://images.unsplash.com/photo-1517861962386-353ba039d67e?auto=format&fit=crop&q=80&w=800',
        'vitamins': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
        'wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
        'mental-health': 'https://images.unsplash.com/photo-1523348834469-65fc06be220f?auto=format&fit=crop&q=80&w=800',
        'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'
    };

    for (const [slug, url] of Object.entries(categoryImages)) {
        try {
            await (prisma as any).reviewCategory.updateMany({
                where: { slug },
                data: { imageUrl: url }
            });
            console.log(`Updated Review Category: ${slug}`);
        } catch (e) {
            // Might not exist yet, skip
        }
    }

    // 2. Update Product Reviews with professional product shots
    const reviews = await (prisma as any).productReview.findMany();
    for (const review of reviews) {
        if (!review.featuredImage || review.featuredImage.includes('placeholder')) {
            await (prisma as any).productReview.update({
                where: { id: review.id },
                data: { featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800' }
            });
            console.log(`Updated Product Review image for: ${review.productName}`);
        }
    }

    // 3. Update Expert Picks Products
    const expertProducts = await (prisma as any).expertPickProduct.findMany();
    for (const product of expertProducts) {
        if (!product.productImage || product.productImage.includes('placeholder')) {
            await (prisma as any).expertPickProduct.update({
                where: { id: product.id },
                data: { productImage: 'https://images.unsplash.com/photo-1550573105-02046af9bc01?auto=format&fit=crop&q=80&w=800' }
            });
            console.log(`Updated Expert Pick Product image for: ${product.productName}`);
        }
    }

    // 4. Update Expert Profiles
    const experts = await prisma.healthExpert.findMany();
    for (const expert of experts) {
        if (!expert.imageUrl || expert.imageUrl.includes('placeholder')) {
            await prisma.healthExpert.update({
                where: { id: expert.id },
                data: { imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200' }
            });
            console.log(`Updated Expert Profile image for: ${expert.name}`);
        }
    }

    console.log('--- Image Enhancement Seeding Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
