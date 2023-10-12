import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { PermissionFlag } from '../src/common/middleware/common.permissionflag.enum';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL as string;
  const password = await argon2.hash(
    process.env.SUPER_ADMIN_PASSWORD as string,
  );
  await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      name: 'FxWallet Admin',
      password: password,
      avatar: 'https://avatars.githubusercontent.com/u/17406834?s=40&v=4',
      permission: PermissionFlag.ALL_PERMISSIONS,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
