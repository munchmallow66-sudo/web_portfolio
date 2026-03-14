"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export default function EditProjectPage() {
    const { lang, dict } = useDictionary();
    const router = useRouter();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            try {
                // Fetch by slug OR ID if we had an internal lookup. 
                // We'll use the public API by getting all and finding this ID since /slug requires the slug 
                // Or we need a specific /api/admin/projects/[id] GET route.
                // For simplicity, we can fetch the detailed GET /api/projects?limit=50 and filter:
                const res = await fetch(`/api/projects?limit=100`);
                const json = await res.json();

                // Find by ID match from payload (since we fetch full slug info via slug usually, 
                // this lazy match works perfectly for MVP without backend rewrites)
                const projectMatch = json.data?.find((p: any) => p.id === id);

                if (projectMatch?.slug) {
                    // Re-fetch deepest details using the public slug viewer API
                    const detailRes = await fetch(`/api/projects/${projectMatch.slug}`);
                    const finalData = await detailRes.json();
                    setInitialData(finalData);
                } else {
                    toast.error("Project not found");
                    router.push("/admin/projects");
                }
            } catch (err) {
                toast.error("Failed to load project");
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchProject();
    }, [id, router]);

    const onSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        const loadingToast = toast.loading(dict.admin.updatingProject);

        try {
            const res = await fetch(`/api/admin/projects/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update project");
            }

            toast.success("Project updated successfully!", { id: loadingToast });
            router.push(`/${lang}/admin/projects`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href={`/${lang}/admin/projects`}
                    className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-accent transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dict.admin.editProjectTitle}</h1>
                    <p className="text-muted-foreground mt-1">{dict.admin.editProjectDesc}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-border">
                {initialData && (
                    <ProjectForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}
