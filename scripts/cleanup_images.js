const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up broken Unsplash URLs...');
    
    // Clear productReview images
    if ('productReview' in prisma) {
        const reviews = await prisma.productReview.findMany();
        let reviewCount = 0;
        for (const review of reviews) {
            if (review.featuredImage && review.featuredImage.includes('unsplash.com')) {
                await prisma.productReview.update({
                    where: { id: review.id },
                    data: { featuredImage: null }
                });
                reviewCount++;
            }
        }
        console.log(`Cleared ${reviewCount} product review images.`);
    }
    
    // Clear expertPickProduct images
    if ('expertPickProduct' in prisma) {
        const products = await prisma.expertPickProduct.findMany();
        let productCount = 0;
        for (const product of products) {
            if (product.productImage && product.productImage.includes('unsplash.com')) {
                await prisma.expertPickProduct.update({
                    where: { id: product.id },
                    data: { productImage: null }
                });
                productCount++;
            }
        }
        console.log(`Cleared ${productCount} expert pick product images.`);
    }
    
    console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
