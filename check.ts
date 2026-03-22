import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const p = await prisma.project.findFirst();
    console.log("PROJECTS DB OK:", !!p || "empty");
    const a = await prisma.activity.findFirst();
    console.log("ACTIVITIES DB OK:", !!a || "empty");
  } catch (e: any) {
    console.log("DB ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
