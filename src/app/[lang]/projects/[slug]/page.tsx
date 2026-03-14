"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowLeft, Github, ExternalLink, Calendar, Eye, Tag, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDictionary } from "@/components/providers/DictionaryProvider";

// Lazy-load Framer Motion
const MotionArticle = dynamic(
    () => import("framer-motion").then((mod) => mod.motion.article),
    { ssr: false }
);
const MotionDiv = dynamic(
    () => import("framer-motion").then((mod) => mod.motion.div),
    { ssr: false }
);

export default function ProjectDetail() {
    const { dict, lang } = useDictionary();
    const { slug } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`/api/projects/${slug}`);
                if (!res.ok) {
                    if (res.status === 404) setError(true);
                    return;
                }
                const data = await res.json();
                setProject(data);
            } catch (err) {
                console.error("Error fetching detail:", err);
                setError(true);
            }
        }
        if (slug) fetchProject();
    }, [slug]);

    if (error) {
        return (
            <div className="container mx-auto px-4 py-32 text-center space-y-6">
                <h1 className="text-4xl font-bold">{dict.projects.notFound}</h1>
                <p className="text-muted-foreground">
                    {dict.projects.notFoundDesc}
                </p>
                <button
                    onClick={() => router.back()}
                    className="text-primary hover:underline"
                >
                    {dict.projects.goBack}
                </button>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 animate-pulse">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        );
    }

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(new Date(project.updatedAt));

    return (
        <MotionArticle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="container mx-auto px-4 py-12 max-w-4xl space-y-12"
        >
            <div className="space-y-6">
                <Link
                    href={`/${lang}/projects`}
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {dict.projects.backToProjects}
                </Link>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance">
                    {project.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    {project.analytics?.views !== undefined && (
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{project.analytics.views} {dict.projects.views}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{dict.projects.released} {formattedDate}</span>
                    </div>

                    <div className="flex gap-4 ml-auto">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-foreground transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                {dict.projects.source}
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-primary text-primary transition-colors font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                {dict.projects.livePreview}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {project.images?.length > 0 && (
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="rounded-2xl overflow-hidden border border-border shadow-md bg-muted aspect-video relative"
                >
                    <Image
                        src={project.images[0].url}
                        alt={`${project.title} Preview`}
                        fill
                        sizes="(max-width: 896px) 100vw, 896px"
                        className="object-cover"
                        priority
                    />
                </MotionDiv>
            )}

            <div className="grid md:grid-cols-[1fr_300px] gap-12">
                <div className="space-y-6 prose prose-neutral dark:prose-invert max-w-none text-foreground text-balance">
                    <h2 className="text-2xl font-bold border-b border-border/50 pb-2">
                        {dict.projects.overview}
                    </h2>
                    <p className="text-lg leading-relaxed">{project.fullDescription}</p>
                </div>

                <aside className="space-y-8">
                    <div className="p-6 rounded-xl border border-border/50 bg-card/50 space-y-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                <Layers className="w-4 h-4" />
                                {dict.projects.techStack}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {project.tags?.length > 0 && (
                            <div className="space-y-3 border-t border-border/50 pt-6">
                                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                                    <Tag className="w-4 h-4" />
                                    {dict.projects.tags}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded-md border border-border"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </MotionArticle>
    );
}
