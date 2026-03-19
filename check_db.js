const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.productReview.findMany({
    where: {
      productName: {
        in: ['JointCare Pro', 'Organic Whey Protein']
      }
    },
    select: {
      productName: true,
      productImage: true
    }
  });
  console.log("DB Products:", products);
}
main().catch(console.error).finally(() => prisma.$disconnect());
