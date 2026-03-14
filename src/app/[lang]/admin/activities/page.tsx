"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Loader2,
    Trash2,
    Edit,
    Calendar,
    MapPin,
    Tag,
    ImageIcon,
    AlertCircle,
} from "lucide-react";
import { useDictionary } from "@/components/providers/DictionaryProvider";

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
    createdAt: string;
}

export default function AdminActivitiesPage() {
    const { dict, lang } = useDictionary();
    const router = useRouter();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const fetchActivities = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/activities");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            const response = await fetch(`/api/admin/activities/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setActivities(activities.filter((a) => a.id !== id));
                setShowDeleteConfirm(null);
            }
        } catch (error) {
            console.error("Failed to delete activity:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        {dict.admin.activities}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {dict.admin.manageActivities}
                    </p>
                </div>
                <Link
                    href={`/${lang}/admin/activities/new`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold px-5 py-3 hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    {dict.admin.addActivity}
                </Link>
            </div>

            {/* Activities Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : activities.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-card/30 backdrop-blur-sm border border-white/10 rounded-2xl"
                >
                    <p className="text-muted-foreground text-lg">
                        {dict.admin.noActivitiesFound}
                    </p>
                    <Link
                        href={`/${lang}/admin/activities/new`}
                        className="inline-flex items-center gap-2 mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {dict.admin.addActivity}
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-[#111827]/80 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
                            >
                                {/* Image Preview */}
                                <div className="relative h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 overflow-hidden">
                                    {activity.images.length > 0 ? (
                                        <img
                                            src={activity.images[0].url}
                                            alt={activity.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <ImageIcon className="w-12 h-12 opacity-30" />
                                        </div>
                                    )}
                                    {activity.images.length > 1 && (
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-xs text-white">
                                            +{activity.images.length - 1}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                        {activity.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-indigo-400" />
                                            {formatDate(activity.date)}
                                        </span>
                                        {activity.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-indigo-400" />
                                                {activity.location}
                                            </span>
                                        )}
                                        {activity.category && (
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-3 h-3 text-indigo-400" />
                                                {activity.category}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                        {activity.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/${lang}/admin/activities/${activity.id}`
                                                )
                                            }
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium px-4 py-2 hover:bg-white/10 transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                            {dict.admin.editActivity}
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowDeleteConfirm(activity.id)
                                            }
                                            disabled={deletingId === activity.id}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium px-4 py-2 hover:bg-red-500/20 transition-all disabled:opacity-50"
                                        >
                                            {deletingId === activity.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#111827] border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    {dict.admin.deleteConfirmTitle}
                                </h3>
                            </div>
                            <p className="text-muted-foreground mb-6">
                                {dict.admin.deleteConfirmDesc}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white font-medium px-4 py-3 hover:bg-white/10 transition-all"
                                >
                                    {dict.admin.cancel}
                                </button>
                                <button
                                    onClick={() =>
                                        handleDelete(showDeleteConfirm)
                                    }
                                    disabled={deletingId === showDeleteConfirm}
                                    className="flex-1 rounded-xl bg-red-500 text-white font-medium px-4 py-3 hover:bg-red-600 transition-all disabled:opacity-50"
                                >
                                    {deletingId === showDeleteConfirm ? (
                                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                    ) : (
                                        dict.admin.delete
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
