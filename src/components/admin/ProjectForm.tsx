"use client";

import { useState, ChangeEvent, useRef, FormEvent } from "react";
import { Loader2, X, Image as ImageIcon, Check } from "lucide-react";
import { useDictionary } from "@/components/providers/DictionaryProvider";

type ProjectFormProps = {
    initialData?: any;
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting: boolean;
};

export function ProjectForm({ initialData, onSubmit, isSubmitting }: ProjectFormProps) {
    const { dict } = useDictionary();
    const [title, setTitle] = useState(initialData?.title || "");
    const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
    const [fullDescription, setFullDescription] = useState(initialData?.fullDescription || "");
    const [techStack, setTechStack] = useState(initialData?.techStack?.join(", ") || "");
    const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
    const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "");
    const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "");
    const [featured, setFeatured] = useState(initialData?.featured || false);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(
        initialData?.images?.map((img: any) => img.url) || []
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);
            const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
    };

    const removeSelectedFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (urlToRemove: string) => {
        setExistingImages((prev) => prev.filter((url) => url !== urlToRemove));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!shortDescription.trim() || shortDescription.trim().length < 10) newErrors.shortDescription = "Provide a better short description (10+ chars)";
        if (!fullDescription.trim() || fullDescription.trim().length < 20) newErrors.fullDescription = "Provide a detailed description (20+ chars)";
        if (!techStack.trim()) newErrors.techStack = "At least one tech is required";
        if (githubUrl && !/^https?:\/\/.+/.test(githubUrl)) newErrors.githubUrl = "Must be a valid URL";
        if (liveUrl && !/^https?:\/\/.+/.test(liveUrl)) newErrors.liveUrl = "Must be a valid URL";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("shortDescription", shortDescription.trim());
        formData.append("fullDescription", fullDescription.trim());
        formData.append("featured", featured.toString());

        if (githubUrl) formData.append("githubUrl", githubUrl.trim());
        if (liveUrl) formData.append("liveUrl", liveUrl.trim());

        // Arrays: split comma-separated strings
        techStack.split(",").map((s: string) => s.trim()).filter(Boolean).forEach((tech: string) => formData.append("techStack", tech));
        tags.split(",").map((s: string) => s.trim()).filter(Boolean).forEach((tag: string) => formData.append("tags", tag));

        // Kept existing image URLs
        existingImages.forEach((url) => formData.append("images", url));

        // New raw files
        selectedFiles.forEach((file) => formData.append("images", file));

        onSubmit(formData);
    };

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Featured Toggle Banner */}
            <label className="flex items-center justify-between p-4 rounded-lg border border-border bg-accent/30 cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="space-y-0.5">
                    <div className="font-semibold">{dict.admin.featuredProject}</div>
                    <div className="text-sm text-muted-foreground">{dict.admin.featuredDesc}</div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
            </label>

            {/* Main Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-full">
                    <label className="text-sm font-medium">{dict.admin.projectTitle}</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="E.g. E-Commerce Platform" />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2 col-span-full">
                    <label className="text-sm font-medium">{dict.admin.shortDescription}</label>
                    <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={inputClass} placeholder="Brief 1-2 sentence overview..." />
                    {errors.shortDescription && <p className="text-sm text-destructive">{errors.shortDescription}</p>}
                </div>

                <div className="space-y-2 col-span-full">
                    <label className="text-sm font-medium">{dict.admin.fullDescription}</label>
                    <textarea
                        value={fullDescription}
                        onChange={(e) => setFullDescription(e.target.value)}
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Detailed write-up of problems solved, architecture, etc..."
                    />
                    {errors.fullDescription && <p className="text-sm text-destructive">{errors.fullDescription}</p>}
                </div>

                {/* URLs */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.admin.githubUrl}</label>
                    <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputClass} placeholder="https://github.com/..." />
                    {errors.githubUrl && <p className="text-sm text-destructive">{errors.githubUrl}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.admin.liveUrl}</label>
                    <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className={inputClass} placeholder="https://..." />
                    {errors.liveUrl && <p className="text-sm text-destructive">{errors.liveUrl}</p>}
                </div>

                {/* Tags and Arrays */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.admin.coreTechStack}</label>
                    <input value={techStack} onChange={(e) => setTechStack(e.target.value)} className={inputClass} placeholder="React, Next.js, Tailwind (comma separated)" />
                    {errors.techStack && <p className="text-sm text-destructive">{errors.techStack}</p>}
                    {techStack.trim() && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {techStack.split(",").map((s: string) => s.trim()).filter(Boolean).map((tech: string, i: number) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">{dict.admin.additionalTags}</label>
                    <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="Open Source, Freelance, Mobile (comma separated)" />
                    {tags.trim() && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {tags.split(",").map((s: string) => s.trim()).filter(Boolean).map((tag: string, i: number) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-md border border-border">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4 pt-4 border-t border-border">
                <label className="text-sm font-medium">{dict.admin.projectMedia}</label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Render previously saved images */}
                    {existingImages.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative aspect-video rounded-md overflow-hidden border border-border group bg-muted/50">
                            <img src={url} alt="Saved thumbnail" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs font-semibold mr-1">{dict.admin.stored}</span>
                                <Check className="w-3 h-3 text-primary" />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeExistingImage(url)}
                                className="absolute top-1 right-1 p-1 bg-destructive/90 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Render new uploads staging */}
                    {previewUrls.map((url, idx) => (
                        <div key={`new-${idx}`} className="relative aspect-video rounded-md overflow-hidden border border-primary group">
                            <img src={url} alt="New upload preview" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">{dict.admin.pendingUpload}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSelectedFile(idx)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}

                    {/* Upload Trigger Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/50 transition-colors"
                    >
                        <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
                        <span className="text-xs font-medium text-muted-foreground">{dict.admin.addFile}</span>
                    </button>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-border flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 w-full sm:w-auto"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dict.admin.saving}
                        </>
                    ) : initialData ? dict.admin.updateProject : dict.admin.publishProject}
                </button>
            </div>
        </form>
    );
}
