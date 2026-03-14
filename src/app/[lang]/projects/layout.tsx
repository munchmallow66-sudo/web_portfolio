import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
    title: "Projects",
    description:
        "Browse my collection of web applications, tools, and open-source contributions.",
    openGraph: {
        title: "Projects",
        description:
            "Browse my collection of web applications, tools, and open-source contributions.",
        url: `${siteConfig.url}/projects`,
    },
};

function CollectionPageJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Projects",
        description:
            "A curated collection of web development projects and open-source contributions.",
        url: `${siteConfig.url}/projects`,
        author: {
            "@type": "Person",
            name: siteConfig.author.name,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CollectionPageJsonLd />
            {children}
        </>
    );
}
