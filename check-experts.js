const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.healthExpert.count();
    console.log('Total experts:', count);
    const featuredCount = await prisma.healthExpert.count({ where: { isFeatured: true } });
    console.log('Featured experts:', featuredCount);
    const experts = await prisma.healthExpert.findMany();
    console.log('Experts:', JSON.stringify(experts, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
