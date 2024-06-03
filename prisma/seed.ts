import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Users
  const user1 = await prisma.user.upsert({
    where: {
      email: 'kristijankej@gmail.com',
    },
    update: {},
    create: {
      email: 'kristijankej@gmail.com',
      password: bcrypt.hashSync('Password123.', 10),
      bio: "I'm a software engineer",
      name: 'Kristijan Kej',
    },
  });
  console.log('Users:', { user1 });
}

if ((process.env.VERCEL_ENV || process.env.NODE_ENV) !== 'production') {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
