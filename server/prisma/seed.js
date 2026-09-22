const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Veagle@123', 10);
  const referralCode = 'worldrecord';

  const admin = await prisma.admin.upsert({
    where: { email: 'abhijeetambhore4@gmail.com' },
    update: {
      password: hashedPassword,
      name: 'admin',
      referralCode: referralCode,
    },
    create: {
      name: 'admin',
      email: 'abhijeetambhore4@gmail.com',
      password: hashedPassword,
      referralCode: referralCode,
    },
  });

  console.log('✅ Seeded admin:', {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    referralCode: admin.referralCode,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
