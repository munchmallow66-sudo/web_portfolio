const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
neonConfig.webSocketConstructor = ws;

require('dotenv').config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Connecting to:", connectionString.substring(0, 30) + '...');
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const act = await prisma.activity.findMany({ take: 1 });
    console.log("Found activities:", act.length);
  } catch (err) {
    console.error("Activity fetch failed:", err);
  }
}
main();
