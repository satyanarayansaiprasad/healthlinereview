import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FlexiMove Plus Review...');

  // 1. Get or Create Author/Reviewer
  const author = await prisma.user.findFirst({
    where: { role: 'WRITER' },
  }) || await prisma.user.create({
    data: {
      name: 'Dr. Rahul Mehta',
      email: 'rahul.mehta@healthlinereview.com',
      password: 'hashed_password_here',
      role: 'WRITER',
    },
  });

  const medicalReviewer = await prisma.healthExpert.findFirst({
    where: { name: 'Dr. Ananya Sharma' },
  }) || await prisma.healthExpert.create({
    data: {
      name: 'Dr. Ananya Sharma',
      designation: 'Orthopedic Specialist',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ef159950?auto=format&fit=crop&q=80&w=200&h=200',
      isFeatured: true,
      specializations: ['Joint Health', 'Sports Medicine'],
    },
  });

  // 2. Get or Create Category
  const category = await prisma.reviewCategory.findFirst({
    where: { slug: 'joint-pain' },
  }) || await prisma.reviewCategory.create({
    data: {
      name: 'Joint Pain',
      slug: 'joint-pain',
      imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=400',
      isStarred: true,
    },
  });

  // 3. Create the Product Review
  const review = await prisma.productReview.upsert({
    where: { slug: 'fleximove-plus-review' },
    update: {},
    create: {
      productName: 'FlexiMove Plus',
      slug: 'fleximove-plus-review',
      rating: 4.9,
      verdict: 'Highly effective for joint pain relief and mobility improvement',
      brand: 'FlexiHealth Labs',
      form: 'Capsules',
      price: '₹2,999',
      guarantee: '60-day money-back',
      sideEffects: 'None reported',
      description: 'FlexiMove Plus is a dietary supplement designed to support joint health, reduce inflammation, and improve mobility. It is formulated using clinically backed ingredients known for their effectiveness in joint care.',
      workingMechanism: 'The supplement works by reducing inflammation, rebuilding cartilage, and improving joint lubrication. Its ingredients target the root causes of joint pain rather than just masking symptoms.',
      pros: ['Fast results', 'Scientifically backed', 'Safe ingredients'],
      cons: ['Premium pricing', 'Limited availability'],
      ingredients: ['Glucosamine', 'Chondroitin', 'MSM', 'Turmeric'],
      detailedIngredients: [
        { name: 'Glucosamine', benefit: 'Helps rebuild cartilage and reduce joint degeneration.' },
        { name: 'Chondroitin', benefit: 'Improves joint flexibility and reduces stiffness.' },
        { name: 'MSM', benefit: 'Supports connective tissue health.' },
        { name: 'Turmeric Extract', benefit: 'Acts as a natural anti-inflammatory agent.' }
      ],
      benefitsList: ['Reduces joint pain', 'Improves mobility', 'Supports long-term joint health', 'Enhances flexibility'],
      safetyInfo: 'No major side effects have been reported. However, individuals with medical conditions should consult a doctor before use.',
      customerReviews: [
        { name: 'Amit S.', rating: 5, comment: 'Worked great for my knee pain within 3 weeks.' },
        { name: 'Priya K.', rating: 4, comment: 'Good product but a bit expensive.' }
      ],
      pricingOffers: [
        { name: '1 Bottle', price: '₹2,999' },
        { name: '3 Bottles', price: '₹7,499 (Save 20%)' },
        { name: '6 Bottles', price: '₹13,999 (Best Value)' }
      ],
      faqs: [
        { question: 'Is it safe?', answer: 'Yes, made with natural ingredients.' },
        { question: 'Where to buy?', answer: 'Official website only.' }
      ],
      recommendation: 'FlexiMove Plus is one of the most effective joint supplements available today. It is highly recommended for individuals suffering from joint pain and stiffness.',
      affiliateLink: 'https://example.com/fleximove-official',
      featuredImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      metaTitle: 'FlexiMove Plus Review 2026: Does It Really Work for Joint Pain?',
      metaDescription: 'Read our expert review of FlexiMove Plus. We analyze ingredients, benefits, safety, and pricing to see if this joint supplement is worth it.',
      authorId: author.id,
      categoryId: category.id,
      medicalReviewerId: medicalReviewer.id,
    }
  });

  console.log(`Success! Review seeded: ${review.productName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
