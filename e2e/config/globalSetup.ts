import { chromium } from '@playwright/test';
import path from 'node:path';
import prisma from '@/lib/prisma';

export default async function globalConfig() {
  const storagePath = path.resolve(__dirname, 'storageState.json');
  const date = new Date();
  const sessionToken = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';

  await prisma.user.upsert({
    where: {
      email: 'foo@test.com',
    },
    create: {
      name: 'userA',
      email: 'foo@test.com',
      sessions: {
        create: {
          expires: new Date(
            date.getFullYear(),
            date.getMonth() + 6,
            date.getDate()
          ),
          sessionToken,
        },
      },
      accounts: {
        create: {
          type: 'oauth',
          provider: 'github',
          providerAccountId: '1234567',
          access_token: '1234567890abcdef1234567890abcdef',
          token_type: 'bearer',
          scope: 'read:user,user::email',
        },
      },
    },
    update: {},
  });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'authjs.session-token',
      value: sessionToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Math.round((Date.now() + 86400000 * 1) / 1000),
    },
  ]);
  await context.storageState({ path: storagePath });
  await browser.close();
}
