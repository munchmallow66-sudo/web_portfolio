import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: siteConfig.url,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${siteConfig.url}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${siteConfig.url}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${siteConfig.url}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    // Dynamic project routes
    let projectRoutes: MetadataRoute.Sitemap = [];

    try {
        const projects = await prisma.project.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
        });

        projectRoutes = projects.map((project) => ({
            url: `${siteConfig.url}/projects/${project.slug}`,
            lastModified: project.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error("[SITEMAP_ERROR]", error);
    }

    return [...staticRoutes, ...projectRoutes];
}
