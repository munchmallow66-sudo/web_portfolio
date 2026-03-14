"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDictionary } from "@/components/providers/DictionaryProvider";

// Simple debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function ProjectsPage() {
    const { dict, lang } = useDictionary();
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    useEffect(() => {
        async function fetchProjects() {
            setIsLoading(true);
            setError("");
            try {
                const res = await fetch(`/api/projects?limit=50`, {
                    cache: 'no-store'
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const json = await res.json();
                if (json.data) {
                    setProjects(json.data);
                } else {
                    setProjects([]);
                }
            } catch (err: any) {
                console.error("Failed to load projects", err);
                setError(dict.projects.loadingError);
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, []);

    // Memoize filtered results
    const filteredProjects = useMemo(() => {
        if (!debouncedSearch) return projects;
        const q = debouncedSearch.toLowerCase();
        return projects.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.shortDescription.toLowerCase().includes(q) ||
                p.techStack.some((t: string) => t.toLowerCase().includes(q))
        );
    }, [projects, debouncedSearch]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {dict.projects.title}
                    </h1>
                    <p className="text-xl text-muted-foreground w-full max-w-xl">
                        {dict.projects.description}
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        className="flex h-12 w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder={dict.projects.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-muted-foreground">
                            {dict.projects.noProjectsFound} &ldquo;{debouncedSearch}&rdquo;.
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all h-full"
                            >
                                <Link
                                    href={`/${lang}/projects/${project.slug}`}
                                    className="absolute inset-0 z-10"
                                    prefetch={false}
                                >
                                    <span className="sr-only">{dict.projects.viewProject} {project.title}</span>
                                </Link>

                                <div className="overflow-hidden bg-muted aspect-video relative">
                                    {project.images?.[0]?.url ? (
                                        <Image
                                            src={project.images[0].url}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
                                            {dict.home.noImage}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                        {project.shortDescription}
                                    </p>

                                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                                        {project.techStack.slice(0, 3).map((tech: string) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-muted-foreground">
                                                +{project.techStack.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
