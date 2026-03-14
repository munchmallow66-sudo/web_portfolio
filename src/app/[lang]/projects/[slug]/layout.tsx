import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import prisma from "@/lib/prisma";

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = params;

    try {
        const project = await prisma.project.findUnique({
            where: { slug },
            select: {
                title: true,
                shortDescription: true,
                techStack: true,
                images: { take: 1, select: { url: true } },
            },
        });

        if (!project) throw new Error("Not found");

        const ogImage = project.images?.[0]?.url || siteConfig.ogImage;
        const title = project.title;
        const description =
            project.shortDescription ||
            `Explore ${project.title} — built with ${project.techStack.slice(0, 3).join(", ")}`;

        return {
            title,
            description,
            openGraph: {
                title: `${title} | ${siteConfig.name}`,
                description,
                url: `${siteConfig.url}/projects/${slug}`,
                type: "article",
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${title} | ${siteConfig.name}`,
                description,
                images: [ogImage],
                creator: siteConfig.author.twitter,
            },
        };
    } catch {
        const displayTitle = slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

        return {
            title: displayTitle,
            description: "In-depth overview and technical specifications of this project.",
        };
    }
}

function ProjectJsonLd({ slug }: { slug: string }) {
    // This is a server component, but we emit a script tag
    // The actual data is populated client-side; we place a static shell here
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        url: `${siteConfig.url}/projects/${slug}`,
        author: {
            "@type": "Person",
            name: siteConfig.author.name,
            url: siteConfig.url,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    return (
        <>
            <ProjectJsonLd slug={params.slug} />
            {children}
        </>
    );
}
