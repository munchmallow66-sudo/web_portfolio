"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { useDictionary } from "@/components/providers/DictionaryProvider";

export default function NewProjectPage() {
    const { lang, dict } = useDictionary();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        const loadingToast = toast.loading(dict.admin.creatingProject);

        try {
            const res = await fetch("/api/admin/projects", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to create project");
            }

            toast.success("Project created successfully!", { id: loadingToast });
            router.push(`/${lang}/admin/projects`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h1 className="text-3xl font-bold tracking-tight">{dict.admin.newProjectTitle}</h1>
                    <p className="text-muted-foreground mt-1">{dict.admin.newProjectDesc}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-border">
                <ProjectForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
