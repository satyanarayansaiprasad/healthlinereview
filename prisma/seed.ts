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

    // SiteSettings (single row)
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: {
                brandName: 'Health Line Review',
                logoUrl: '/logo.svg',
                tagline: 'Trusted Reviews, Honest Ratings and Quality Advice',
                primaryColor: '#0d9488',
                secondaryColor: '#1e293b',
                accentColor: '#0f766e',
                heroTitle: 'Trusted Reviews, Honest Ratings and Quality Advice',
                heroSubtitle: 'Health Line Review is your premier source for evidence-based health and wellness information and unbiased product reviews.',
                heroCtaPrimary: 'Explore Health Topics',
                heroCtaSecondary: 'Latest Reviews',
                footerTagline: 'Providing expert-reviewed health information, product reviews, and wellness tips to help you live a healthier life.',
                contactEmail: 'contact@healthlinereview.com',
                contactPhone: '+1 (555) 123-4567',
                address: '3 E Evergreen Road, Suite 101, New City, NY 10956, United States',
            },
        });
        console.log('Created site settings');
    }

    // NavLink (top-level and Company children)
    const navCount = await prisma.navLink.count();
    if (navCount === 0) {
        const company = await prisma.navLink.create({
            data: { label: 'Company', href: '#', order: 40, parentId: null },
        });
        await prisma.navLink.createMany({
            data: [
                { label: 'Health Topics', href: '/health-topics', order: 10, parentId: null },
                { label: 'Brands', href: '/brands', order: 20, parentId: null },
                { label: 'Supplements', href: '/supplements', order: 30, parentId: null },
                { label: 'Expert Picks', href: '/expert-picks', order: 50, parentId: null },
                { label: 'Reviews', href: '/product-reviews', order: 60, parentId: null },
                { label: 'About Us', href: '/about-us', order: 1, parentId: company.id },
                { label: 'Contact Us', href: '/contact-us', order: 2, parentId: company.id },
                { label: 'Frequently Asked Question', href: '/faq', order: 3, parentId: company.id },
                { label: 'Review Guidelines', href: '/review-guidelines', order: 4, parentId: company.id },
            ],
        });
        console.log('Created nav links');
    }

    // FooterSection
    const footerCount = await prisma.footerSection.count();
    if (footerCount === 0) {
        await prisma.footerSection.createMany({
            data: [
                { title: 'Explore', links: [{ label: 'Health Topics', href: '/health-topics' }, { label: 'Brands', href: '/brands' }, { label: 'Supplements', href: '/supplements' }, { label: 'Product Reviews', href: '/product-reviews' }], order: 10 },
                { title: 'Company', links: [{ label: 'About Us', href: '/about-us' }, { label: 'Contact Us', href: '/contact-us' }, { label: 'Editorial Policy', href: '/review-guidelines' }, { label: 'Privacy Policy', href: '/faq' }], order: 20 },
            ],
        });
        console.log('Created footer sections');
    }

    // PageContent (about, contact, faq, review-guidelines)
    const pages = [
        { slug: 'about-us', title: 'About Us', metaTitle: 'About Us | Health Line Review', metaDescription: 'Learn about Health Line Review mission and team.', content: [{ type: 'paragraph', content: 'Health Line Review is dedicated to the pursuit of medical transparency. We bridge the gap between complex science and your daily wellness journey.' }] },
        { slug: 'contact-us', title: 'Contact Us', metaTitle: 'Contact Us | Health Line Review', metaDescription: 'Get in touch with Health Line Review.', content: [{ type: 'paragraph', content: 'Reach out via email or phone. We are here to help.' }] },
        { slug: 'faq', title: 'Frequently Asked Questions', metaTitle: 'FAQ | Health Line Review', metaDescription: 'Common questions and answers.', content: [{ type: 'paragraph', content: 'Find answers to frequently asked questions about our reviews and process.' }] },
        { slug: 'review-guidelines', title: 'Review Guidelines', metaTitle: 'Review Guidelines | Health Line Review', metaDescription: 'How we review products.', content: [{ type: 'paragraph', content: 'Our team follows strict guidelines to ensure honest, unbiased product reviews.' }] },
    ];
    for (const p of pages) {
        const exists = await prisma.pageContent.findUnique({ where: { slug: p.slug } });
        if (!exists) {
            await prisma.pageContent.create({ data: { ...p, content: p.content as object } });
            console.log('Created page:', p.slug);
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
