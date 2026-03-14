import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            include: {
                images: true,
            },
            orderBy: {
                date: "desc",
            },
        });

        const response = NextResponse.json(activities);
        response.headers.set(
            "Cache-Control",
            "public, max-age=60, stale-while-revalidate=300"
        );
        return response;
    } catch (error) {
        console.error("[ACTIVITIES_GET]", error);
        return NextResponse.json(
            { error: "Failed to fetch activities" },
            { status: 500 }
        );
    }
}
