import { getDictionary, Locale } from "@/lib/i18n";
import { ActivityForm } from "@/components/admin/ActivityForm";

export default async function NewActivityPage({
    params,
}: {
    params: { lang: Locale };
}) {
    const dict = await getDictionary(params.lang);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">
                    {dict.admin.newActivityTitle}
                </h1>
                <p className="text-muted-foreground">
                    {dict.admin.newActivityDesc}
                </p>
            </div>

            <div className="bg-[#111827]/50 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
                <ActivityForm lang={params.lang} />
            </div>
        </div>
    );
}
