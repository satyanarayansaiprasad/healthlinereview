import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Expert Picks Seeding Started ---');

    // 1. Ensure Author User (Dr. Rahul Mehta)
    const authorEmail = 'rahul.mehta@healthlinereview.com';
    let author = await prisma.user.findUnique({ where: { email: authorEmail } });
    if (!author) {
        author = await prisma.user.create({
            data: {
                name: 'Dr. Rahul Mehta',
                email: authorEmail,
                password: 'PlaceholderPassword123!', // Required by schema
                role: 'WRITER'
            }
        });
        console.log('Created Author:', author.name);
    }

    // 2. Ensure Medical Reviewer (Dr. Ananya Sharma)
    let reviewer = await prisma.healthExpert.findFirst({ where: { name: 'Dr. Ananya Sharma' } });
    if (!reviewer) {
        reviewer = await prisma.healthExpert.create({
            data: {
                name: 'Dr. Ananya Sharma',
                designation: 'Medical Reviewer',
                specializations: ['Joint Health', 'Orthopedics', 'Internal Medicine'],
                imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200&h=200',
                isFeatured: true
            }
        });
        console.log('Created Reviewer:', reviewer.name);
    }

    // 3. Ensure Category exists
    let category = await prisma.reviewCategory.findFirst({ where: { slug: 'supplements' } });
    if (!category) {
        category = await prisma.reviewCategory.create({
            data: {
                name: 'Supplements',
                slug: 'supplements',
                imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
                isStarred: true
            }
        });
        console.log('Created Category:', category.name);
    }

    // 4. Create Expert Picks Guide
    const guideSlug = 'best-joint-pain-supplements-2026';
    const existingGuide = await prisma.expertPicksGuide.findUnique({ where: { slug: guideSlug } });
    
    if (existingGuide) {
        console.log('Guide already exists, skipping creation.');
        return;
    }

    const guide = await prisma.expertPicksGuide.create({
        data: {
            title: 'Best Joint Pain Supplements in 2026 – Expert Picks & Reviews',
            slug: guideSlug,
            description: 'Our team analyzed 40+ joint health supplements based on ingredients, safety, customer feedback, and clinical research. Here are the top-performing products this year.',
            authorId: author.id,
            medicalReviewerId: reviewer.id,
            categoryId: category.id,
            metaTitle: 'Best Joint Pain Supplements in 2026 | Doctor Reviewed Listicles',
            metaDescription: 'Discover the top-rated joint support supplements of 2026. Reviewed by Dr. Rahul Mehta and medically verified by Dr. Ananya Sharma.',
            howWeRanked: [
                "Ingredient Quality (Purity & Potency)",
                "Clinical Research Support & Evidence",
                "Customer Feedback & Real-world results",
                "Brand Reputation & Transparency",
                "Safety Profile & Side Effects monitoring"
            ],
            faqs: [
                {
                    question: "Do joint supplements really work?",
                    answer: "Yes, especially those with clinically tested ingredients like Glucosamine and Turmeric. However, individual results vary based on the severity of the condition."
                },
                {
                    question: "How long before results?",
                    answer: "Most users notice significant improvement within 2–6 weeks of consistent use, depending on the supplement and severity of joint discomfort."
                }
            ],
            buyingGuide: {
                whatToLookFor: [
                    "Clinically proven ingredients (e.g. Glucosamine, Chondroitin, Turmeric)",
                    "Transparent labeling (Avoiding proprietary blends)",
                    "Positive third-party verified user reviews"
                ],
                whatToAvoid: [
                    "Hidden blends with undisclosed dosages",
                    "Artificial additives and fillers",
                    "Unrealistic medical claims"
                ]
            },
            ingredientsAnalysis: [
                {
                    name: "Glucosamine",
                    benefit: "Supports cartilage repair and reduces joint stiffness.",
                    rating: "Highly Effective"
                },
                {
                    name: "Chondroitin",
                    benefit: "Improves joint lubrication and flexibility.",
                    rating: "Essential"
                },
                {
                    name: "Turmeric Extract",
                    benefit: "Natural anti-inflammatory compound for pain relief.",
                    rating: "Strong Evidence"
                }
            ],
            finalVerdict: {
                summary: "FlexiMove Plus stands out as the best overall supplement due to its powerful ingredient profile and fast results.",
                winner: "FlexiMove Plus"
            },
            products: {
                create: [
                    {
                        rank: 1,
                        productName: 'FlexiMove Plus',
                        award: 'BEST OVERALL',
                        rating: 4.9,
                        shortHighlight: 'Fast joint pain relief & mobility support',
                        price: '₹2,999',
                        buyLink: 'https://example.com/fleximove',
                        pros: ['Works within weeks', 'Backed by clinical research', 'No major side effects reported'],
                        cons: ['Slightly expensive', 'Only available via official store'],
                        highlights: [
                            'Contains Glucosamine & Chondroitin',
                            'Fast absorption formula',
                            'Supports cartilage repair'
                        ],
                        productImage: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400'
                    },
                    {
                        rank: 2,
                        productName: 'JointCare Pro',
                        award: 'BEST LONG-TERM SUPPORT',
                        rating: 4.7,
                        shortHighlight: 'Natural anti-inflammatory focus',
                        price: '₹1,599',
                        buyLink: 'https://example.com/jointcare',
                        pros: ['Highly affordable', 'Excellent for aging joints', 'Natural compounds'],
                        cons: ['Slower initial results', 'Tablets have a mild earthy taste'],
                        highlights: [
                            'Pure Turmeric extract',
                            'MSM compound for flexibility',
                            'Supports long-term joint health'
                        ],
                        productImage: 'https://images.unsplash.com/photo-1471864190281-a93a3072467a?auto=format&fit=crop&q=80&w=400'
                    },
                    {
                        rank: 3,
                        productName: 'ArthroEase',
                        award: 'BEST BUDGET OPTION',
                        rating: 4.6,
                        shortHighlight: 'Effective for mild discomfort',
                        price: '₹899',
                        buyLink: 'https://example.com/arthroease',
                        pros: ['Cost-effective', 'Easy to swallow capsules', 'Good basic formula'],
                        cons: ['Limited ingredient profile', 'Not recommended for severe chronic pain'],
                        highlights: [
                            'Daily maintenance formula',
                            'Safe for long-term use',
                            'No artificial fillers'
                        ],
                        productImage: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?auto=format&fit=crop&q=80&w=400'
                    }
                ]
            }
        }
    });

    console.log('Created Guide:', guide.title);
    console.log('--- Expert Picks Seeding Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
