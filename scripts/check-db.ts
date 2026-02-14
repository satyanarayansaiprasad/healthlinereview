import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const categories = await prisma.category.findMany();
        console.log('Categories:', categories.length);
        const articles = await prisma.article.findMany();
        console.log('Articles:', articles.length);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
