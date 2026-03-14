import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/lib/i18n";
import prisma from "@/lib/prisma";
import { ActivityForm } from "@/components/admin/ActivityForm";

async function getActivity(id: string) {
    try {
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: {
                images: true,
            },
        });
        if (!activity) return null;
        // Serialize dates to strings for client component
        return {
            ...activity,
            date: activity.date.toISOString(),
            createdAt: activity.createdAt.toISOString(),
            updatedAt: activity.updatedAt.toISOString(),
        };
    } catch {
        return null;
    }
}

export default async function EditActivityPage({
    params,
}: {
    params: { lang: Locale; id: string };
}) {
    const dict = await getDictionary(params.lang);
    const activity = await getActivity(params.id);

    if (!activity) {
        notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                    {dict.admin.editActivity}
                </h1>
                <p className="text-muted-foreground">
                    {dict.admin.editProjectDesc}
                </p>
            </div>

            <div className="bg-[#111827]/50 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
                <ActivityForm activity={activity} lang={params.lang} />
            </div>
        </div>
    );
}
