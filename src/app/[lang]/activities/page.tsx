"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Tag, Loader2 } from "lucide-react";
import { useDictionary } from "@/components/providers/DictionaryProvider";
import { ParticleNetwork } from "@/components/ui/ParticleNetwork";

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

export default function ActivitiesPage() {
    const { dict } = useDictionary();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch("/api/activities");
                if (!response.ok) {
                    throw new Error("Failed to fetch activities");
                }
                const data = await response.json();
                setActivities(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
            {/* Background Effect */}
            <div className="fixed inset-0 opacity-30">
                <ParticleNetwork />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                        {dict.activities.title}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {dict.activities.description}
                    </p>
                </motion.div>

                {/* Activities List */}
                {error ? (
                    <div className="text-center text-red-400 py-12">
                        {error}
                    </div>
                ) : activities.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <p className="text-muted-foreground text-lg">
                            {dict.activities.noActivities}
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Images */}
                                    {activity.images.length > 0 && (
                                        <div className="lg:w-1/3">
                                            <div className="grid grid-cols-2 gap-2">
                                                {activity.images.slice(0, 4).map((image, imgIndex) => (
                                                    <div
                                                        key={image.id}
                                                        className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                                                            activity.images.length === 1
                                                                ? "col-span-2 aspect-video"
                                                                : activity.images.length === 2
                                                                ? "col-span-1 aspect-square"
                                                                : "aspect-square"
                                                        }`}
                                                        onClick={() => setSelectedImage(image.url)}
                                                    >
                                                        <Image
                                                            src={image.url}
                                                            alt={`${activity.title} - ${imgIndex + 1}`}
                                                            fill
                                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                                        {imgIndex === 3 && activity.images.length > 4 && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                <span className="text-white text-lg font-semibold">
                                                                    +{activity.images.length - 4}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-white mb-3">
                                            {activity.title}
                                        </h2>

                                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-indigo-400" />
                                                <span>{formatDate(activity.date)}</span>
                                            </div>
                                            {activity.location && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-indigo-400" />
                                                    <span>{activity.location}</span>
                                                </div>
                                            )}
                                            {activity.category && (
                                                <div className="flex items-center gap-1.5">
                                                    <Tag className="w-4 h-4 text-indigo-400" />
                                                    <span className="px-2 py-0.5 bg-indigo-500/10 rounded-full text-indigo-300">
                                                        {activity.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {activity.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh] w-full">
                        <Image
                            src={selectedImage}
                            alt="Activity image"
                            width={1200}
                            height={800}
                            className="object-contain w-full h-full rounded-lg"
                        />
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-indigo-400 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            ปิด
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
