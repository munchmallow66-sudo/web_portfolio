"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Loader2,
    Plus,
    X,
    Upload,
    Calendar,
    MapPin,
    Tag,
    FileText,
    Type,
} from "lucide-react";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { cn } from "@/lib/utils";

interface ActivityImage {
    id: string;
    url: string;
}

interface Activity {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string | null;
    category: string | null;
    images: ActivityImage[];
}

interface ActivityFormProps {
    activity?: Activity;
    lang: string;
}

export function ActivityForm({ activity, lang }: ActivityFormProps) {
    const { dict } = useDictionary();
    const router = useRouter();
    const isEdit = !!activity;

    const [formData, setFormData] = useState({
        title: activity?.title || "",
        description: activity?.description || "",
        date: activity?.date
            ? new Date(activity.date).toISOString().split("T")[0]
            : "",
        location: activity?.location || "",
        category: activity?.category || "",
    });

    const [existingImages, setExistingImages] = useState<ActivityImage[]>(
        activity?.images || []
    );
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            const validFiles = files.filter((file) => {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`File "${file.name}" exceeds 5MB limit`);
                    return false;
                }
                if (!file.type.startsWith("image/")) {
                    alert(`File "${file.name}" is not an image`);
                    return false;
                }
                return true;
            });

            setNewFiles((prev) => [...prev, ...validFiles]);

            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewFilePreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        },
        []
    );

    const removeExistingImage = (imageId: string) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const removeNewFile = (index: number) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
        setNewFilePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        if (!formData.date) newErrors.date = "Date is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();
            submitFormData.append("title", formData.title);
            submitFormData.append("description", formData.description);
            submitFormData.append("date", formData.date);
            if (formData.location)
                submitFormData.append("location", formData.location);
            if (formData.category)
                submitFormData.append("category", formData.category);

            // Add existing image URLs
            existingImages.forEach((img) => {
                submitFormData.append("images", img.url);
            });

            // Add new files
            newFiles.forEach((file) => {
                submitFormData.append("images", file);
            });

            const url = isEdit
                ? `/api/admin/activities/${activity.id}`
                : "/api/admin/activities";
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: submitFormData,
            });

            if (response.ok) {
                router.push(`/${lang}/admin/activities`);
                router.refresh();
            } else {
                const error = await response.json();
                alert(error.error || "Failed to save activity");
            }
        } catch (error) {
            console.error("Failed to save activity:", error);
            alert("Failed to save activity");
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalImages = existingImages.length + newFiles.length;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <Type className="w-4 h-4 text-indigo-400" />
                    {dict.admin.activityTitle} *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={cn(
                        "w-full bg-[#111827]/50 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                        errors.title ? "border-red-500" : "border-white/10"
                    )}
                    placeholder="Enter activity title"
                />
                {errors.title && (
                    <p className="text-red-400 text-sm">{errors.title}</p>
                )}
            </motion.div>

            {/* Date & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        {dict.admin.activityDate} *
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={cn(
                            "w-full bg-[#111827]/50 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all",
                            errors.date ? "border-red-500" : "border-white/10"
                        )}
                    />
                    {errors.date && (
                        <p className="text-red-400 text-sm">{errors.date}</p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                >
                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                        <MapPin className="w-4 h-4 text-indigo-400" />
                        {dict.admin.activityLocation}
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-[#111827]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="Enter location"
                    />
                </motion.div>
            </div>

            {/* Category */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
            >
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <Tag className="w-4 h-4 text-indigo-400" />
                    {dict.admin.activityCategory}
                </label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#111827]/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    placeholder="e.g., Workshop, Seminar, Competition"
                />
            </motion.div>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
            >
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    {dict.admin.activityDescription} *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={cn(
                        "w-full bg-[#111827]/50 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none",
                        errors.description ? "border-red-500" : "border-white/10"
                    )}
                    placeholder="Describe the activity..."
                />
                {errors.description && (
                    <p className="text-red-400 text-sm">{errors.description}</p>
                )}
            </motion.div>

            {/* Images */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    {dict.admin.activityImages}
                    <span className="text-xs text-muted-foreground">
                        ({totalImages}/10)
                    </span>
                </label>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((image) => (
                            <div
                                key={image.id}
                                className="relative aspect-square rounded-xl overflow-hidden group"
                            >
                                <img
                                    src={image.url}
                                    alt="Activity"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(image.id)}
                                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-1 bg-indigo-500/80 rounded text-xs text-white">
                                    {dict.admin.stored}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* New File Previews */}
                {newFilePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {newFilePreviews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative aspect-square rounded-xl overflow-hidden group"
                            >
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(index)}
                                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500/80 rounded text-xs text-white">
                                    {dict.admin.pendingUpload}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button */}
                {totalImages < 10 && (
                    <label className="flex items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all">
                        <Plus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {dict.admin.addFile}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                )}
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex gap-4 pt-4"
            >
                <button
                    type="button"
                    onClick={() => router.push(`/${lang}/admin/activities`)}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white font-semibold px-6 py-4 hover:bg-white/10 transition-all"
                >
                    {dict.admin.cancel}
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold px-6 py-4 hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isEdit
                                ? dict.admin.updatingProject
                                : dict.admin.creatingProject}
                        </>
                    ) : isEdit ? (
                        dict.admin.updateProject
                    ) : (
                        dict.admin.publishProject
                    )}
                </button>
            </motion.div>
        </form>
    );
}
