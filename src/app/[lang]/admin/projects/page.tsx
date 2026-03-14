"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export default function AdminProjectsList() {
    const { lang, dict } = useDictionary();
    const [projects, setProjects] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>({ page: 1, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchProjects = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/projects?page=${page}&limit=10`);
            if (res.ok) {
                const json = await res.json();
                setProjects(json.data);
                setMeta(json.meta);
            }
        } catch (err) {
            toast.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        const loadingToast = toast.loading("Deleting project...");

        // Optimistic UI update
        const previousProjects = [...projects];
        setProjects(projects.filter((p) => p.id !== deleteId));

        try {
            const res = await fetch(`/api/admin/projects/${deleteId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Project deleted successfully", { id: loadingToast });
            } else {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            toast.error("Error deleting project", { id: loadingToast });
            setProjects(previousProjects); // Rollback optimistic update
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.admin.projects}</h1>
                    <p className="text-muted-foreground mt-1">{dict.admin.managePortfolio}</p>
                </div>
                <Link
                    href={`/${lang}/admin/projects/new`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 whitespace-nowrap"
                >
                    <Plus className="mr-2 h-4 w-4" /> {dict.admin.addProject}
                </Link>
            </div>

            <div className="rounded-md border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left relative">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-4 py-3 font-semibold">{dict.admin.titleLabel}</th>
                                <th className="px-4 py-3 font-semibold">{dict.admin.tagsLabel}</th>
                                <th className="px-4 py-3 font-semibold text-center">{dict.admin.featuredLabel}</th>
                                <th className="px-4 py-3 font-semibold text-right">{dict.admin.actionsLabel}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground animate-pulse">
                                        {dict.admin.loadingProjects}
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        {dict.admin.noProjects}
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-foreground">
                                            <div className="flex items-center gap-2">
                                                {project.title}
                                                <Link
                                                    href={`/${lang}/projects/${project.slug}`}
                                                    target="_blank"
                                                    className="text-muted-foreground hover:text-primary transition-colors"
                                                    title="View live page"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {project.techStack?.slice(0, 2).map((tag: string) => (
                                                    <span key={tag} className="px-2 py-0.5 bg-accent text-accent-foreground text-[10px] rounded border border-border whitespace-nowrap">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {project.techStack?.length > 2 && (
                                                    <span className="text-muted-foreground text-[10px] ml-1">+{project.techStack.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {project.featured ? (
                                                <Star className="w-4 h-4 fill-primary text-primary mx-auto" />
                                            ) : (
                                                <Star className="w-4 h-4 text-muted-foreground mx-auto opacity-30" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${lang}/admin/projects/${project.id}`}
                                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(project.id)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {meta.totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 mt-4 text-sm">
                    <button
                        disabled={meta.page <= 1}
                        onClick={() => fetchProjects(meta.page - 1)}
                        className="px-3 py-1 border border-border rounded-md hover:bg-accent disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-muted-foreground px-2">Page {meta.page} of {meta.totalPages}</span>
                    <button
                        disabled={meta.page >= meta.totalPages}
                        onClick={() => fetchProjects(meta.page + 1)}
                        className="px-3 py-1 border border-border rounded-md hover:bg-accent disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Tailwind basic Modal for Deletion Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-lg p-6 space-y-4">
                        <h3 className="text-lg font-bold">{dict.admin.deleteConfirmTitle}</h3>
                        <p className="text-muted-foreground text-sm">{dict.admin.deleteConfirmDesc}</p>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent transition-colors"
                            >
                                {dict.admin.cancel}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                            >
                                {dict.admin.delete}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
