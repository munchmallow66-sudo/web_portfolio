import Link from "next/link";
import { FolderKanban, CalendarDays, PlusCircle } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";

export default async function AdminPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);
    const lang = params.lang;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">{dict.admin.dashboard}</h1>
                <p className="text-muted-foreground text-lg">
                    {dict.admin.manageDesc}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Projects Card */}
                <div className="rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 p-8 flex flex-col group">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="tracking-tight text-sm font-semibold text-gray-300 uppercase">{dict.admin.totalProjects}</h3>
                        <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                            <FolderKanban className="h-5 w-5 text-indigo-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{dict.admin.manageContent}</div>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed flex-1">
                        {dict.admin.headToProjects}
                    </p>
                    <div className="pt-6 flex gap-3 mt-auto">
                        <Link
                            href={`/${lang}/admin/projects`}
                            className="inline-flex flex-1 items-center justify-center rounded-xl text-sm font-semibold border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 hover:border-white/20 text-white transition-all h-11 px-4"
                        >
                            {dict.admin.viewAll}
                        </Link>
                        <Link
                            href={`/${lang}/admin/projects/new`}
                            className="inline-flex flex-1 items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow hover:shadow-indigo-500/25 transition-all h-11 px-4"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {dict.admin.addNew}
                        </Link>
                    </div>
                </div>

                {/* Activities Card */}
                <div className="rounded-2xl border border-white/10 bg-[#111827]/80 backdrop-blur shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-4 p-8 flex flex-col group">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="tracking-tight text-sm font-semibold text-gray-300 uppercase">{dict.admin.totalActivities}</h3>
                        <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                            <CalendarDays className="h-5 w-5 text-indigo-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">{dict.admin.manageActivities}</div>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed flex-1">
                        {dict.admin.headToProjects.replace('โปรเจค', 'กิจกรรม').replace('projects', 'activities')}
                    </p>
                    <div className="pt-6 flex gap-3 mt-auto">
                        <Link
                            href={`/${lang}/admin/activities`}
                            className="inline-flex flex-1 items-center justify-center rounded-xl text-sm font-semibold border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 hover:border-white/20 text-white transition-all h-11 px-4"
                        >
                            {dict.admin.viewAll}
                        </Link>
                        <Link
                            href={`/${lang}/admin/activities/new`}
                            className="inline-flex flex-1 items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow hover:shadow-indigo-500/25 transition-all h-11 px-4"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {dict.admin.addNew}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
