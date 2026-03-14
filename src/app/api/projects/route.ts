import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50); // Cap at 50
        const featured = searchParams.get("featured");
        const skip = (page - 1) * limit;

        const where = featured === "true" ? { featured: true } : {};

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    shortDescription: true,
                    techStack: true,
                    tags: true,
                    featured: true,
                    createdAt: true,
                    images: {
                        take: 1,
                        select: { url: true },
                    },
                },
            }),
            prisma.project.count({ where }),
        ]);

        const response = NextResponse.json({
            data: projects,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });

        // Cache public project listing for 60s, stale-while-revalidate for 5 min
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=60, stale-while-revalidate=300"
        );

        return response;
    } catch (error) {
        console.error("[PROJECTS_GET]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
