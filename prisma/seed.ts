import { PrismaClient, ArticleStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Seed User
    let user = await prisma.user.findFirst({ where: { email: 'admin@healthhub.pro' } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: 'Dr. Sarah Johnson',
                email: 'admin@healthhub.pro',
                password: 'hashed_password_placeholder', // In real app, hash this
                role: 'SUPER_ADMIN',
            },
        });
        console.log('Created user:', user.name);
    }

    // Seed Categories
    const categories = ['Wellness', 'Nutrition', 'Mental Health', 'Fitness', 'Supplements'];
    const createdCategories = [];

    for (const catName of categories) {
        const slug = catName.toLowerCase().replace(' ', '-');
        let cat = await prisma.category.findUnique({ where: { slug } });
        if (!cat) {
            cat = await prisma.category.create({
                data: {
                    name: catName,
                    slug,
                    metaTitle: `${catName} Tips & Guides`,
                    metaDescription: `Expert advice on ${catName}.`,
                },
            });
            console.log('Created category:', cat.name);
        }
        createdCategories.push(cat);
    }

    // Seed Articles
    const articleData = [
        {
            title: 'The Science of Sleep: Why Rest is Your Best Medicine',
            slug: 'science-of-sleep',
            content: '<p>Sleep is fundamental to our health.</p>',
            categoryId: createdCategories.find(c => c.slug === 'wellness')?.id,
            authorId: user.id,
            status: ArticleStatus.PUBLISHED,
        },
        {
            title: 'Top 10 Superfoods for Brain Power',
            slug: 'superfoods-brain-power',
            content: '<p>Eat blueberries and walnuts.</p>',
            categoryId: createdCategories.find(c => c.slug === 'nutrition')?.id,
            authorId: user.id,
            status: ArticleStatus.PUBLISHED,
        },
        {
            title: 'Managing Anxiety in a Digital World',
            slug: 'managing-anxiety',
            content: '<p>Disconnect to reconnect.</p>',
            categoryId: createdCategories.find(c => c.slug === 'mental-health')?.id,
            authorId: user.id,
            status: ArticleStatus.PUBLISHED,
        },
    ];

    for (const a of articleData) {
        if (!a.categoryId) continue;
        const exists = await prisma.article.findUnique({ where: { slug: a.slug } });
        if (!exists) {
            await prisma.article.create({
                data: {
                    title: a.title,
                    slug: a.slug,
                    content: a.content,
                    status: a.status,
                    categoryId: a.categoryId,
                    authorId: a.authorId,
                }
            });
            console.log('Created article:', a.title);
        }
    }

    // Seed Product Reviews
    const reviews = [
        {
            productName: 'Organic Whey Protein',
            slug: 'organic-whey',
            rating: 4.8,
            pros: ['Grass-fed', 'No fillers'],
            cons: ['Expensive'],
            ingredients: ['Whey Protein Concentrate'],
            content: 'Best protein on the market.',
            authorId: user.id,
        },
        {
            productName: 'Focus Factor Nootropic',
            slug: 'focus-factor',
            rating: 4.2,
            pros: ['Clinically tested'],
            cons: ['Takes time to work'],
            ingredients: ['Bacopa', 'Ginkgo'],
            content: 'Solid choice for exams.',
            authorId: user.id,
        }
    ];

    for (const r of reviews) {
        const exists = await prisma.productReview.findUnique({ where: { slug: r.slug } });
        if (!exists) {
            await prisma.productReview.create({
                data: r
            });
            console.log('Created review:', r.productName);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
