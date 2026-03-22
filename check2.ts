import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const a = await prisma.activity.findFirst();
    fs.writeFileSync('d:/web_portfolio/result.txt', "ACTIVITIES DB OK: " + (!!a || "empty"));
  } catch (e: any) {
    fs.writeFileSync('d:/web_portfolio/result.txt', "DB ERROR: " + e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
