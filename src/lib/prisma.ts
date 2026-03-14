import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { logger } from "@/lib/logger";

// Edge compatible config
import ws from "ws";
neonConfig.webSocketConstructor = ws;

const prismaClientSingleton = () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error(
            "DATABASE_URL is not defined. Check your environment variables."
        );
    }

    const adapter = new PrismaNeon({ connectionString });

    const client = new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? [
                    { emit: "event", level: "query" },
                    { emit: "stdout", level: "error" },
                    { emit: "stdout", level: "warn" },
                ]
                : [{ emit: "stdout", level: "error" }],
    });

    // Development query logging
    if (process.env.NODE_ENV === "development") {
        (client as any).$on("query", (e: any) => {
            if (e.duration > 100) {
                logger.warn(`Slow query (${e.duration}ms): ${e.query}`, "PRISMA");
            }
        });
    }

    return client;
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
