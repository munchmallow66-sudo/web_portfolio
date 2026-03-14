import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            );
        }

        const project = await prisma.project.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                shortDescription: true,
                fullDescription: true,
                techStack: true,
                tags: true,
                githubUrl: true,
                liveUrl: true,
                featured: true,
                createdAt: true,
                updatedAt: true,
                images: {
                    select: { id: true, url: true },
                },
                analytics: {
                    select: { views: true },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        // View Tracking Logic (24h cookie debounce)
        const cookieName = `viewed_project_${project.id}`;
        const hasViewed = request.cookies.get(cookieName);
        let updatedProject = { ...project };

        if (!hasViewed) {
            try {
                const analytics = await prisma.analytics.upsert({
                    where: { projectId: project.id },
                    create: { projectId: project.id, views: 1 },
                    update: { views: { increment: 1 } },
                    select: { views: true },
                });
                updatedProject.analytics = analytics;
            } catch (err) {
                console.error("[ANALYTICS_UPDATE_ERROR]", err);
            }
        }

        const response = NextResponse.json(updatedProject);

        // Cache detail page for 5 minutes (stale data OK since views are approximate)
        response.headers.set(
            "Cache-Control",
            "public, s-maxage=300, stale-while-revalidate=600"
        );

        if (!hasViewed) {
            response.cookies.set({
                name: cookieName,
                value: "true",
                path: "/",
                httpOnly: true,
                maxAge: 60 * 60 * 24, // 24 hours
                sameSite: "lax",
            });
        }

        return response;
    } catch (error) {
        console.error("[PROJECT_GET]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
