import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { getDictionary, Locale } from "@/lib/i18n";
import { 
    Code2, 
    Wrench, 
    Terminal, 
    Brain,
    Database,
    Layers,
    GitBranch,
    Cloud,
    Gamepad2,
    Sparkle
} from "lucide-react";

export const metadata: Metadata = {
    title: "Skills",
    description: "My technical skills, tools, and technologies I use for development.",
    openGraph: {
        title: "Skills",
        description: "Technical skills and tools",
        url: `${siteConfig.url}/skills`,
    },
};

// Level colors
const levelColors: Record<string, string> = {
    'ระดับพื้นฐาน': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'ระดับสูง': 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    'ระดับปานกลาง': 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    'Basic': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Advanced': 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    'Intermediate': 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
};

// Tool category icons and colors
const toolConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
    'deployment': { icon: Cloud, color: 'text-sky-400', bgColor: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20' },
    'media': { icon: Layers, color: 'text-pink-400', bgColor: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20' },
    'version-control': { icon: GitBranch, color: 'text-orange-400', bgColor: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20' },
    'game-dev': { icon: Gamepad2, color: 'text-violet-400', bgColor: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20' },
    'data': { icon: Database, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20' },
    'design': { icon: Sparkle, color: 'text-amber-400', bgColor: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
};

export default async function SkillsPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);
    const skills = dict.skills;

    return (
        <div className="container mx-auto px-4 py-24 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {skills.title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {skills.description}
                </p>
            </div>

            {/* Skills Grid */}
            <div className="space-y-8">
                {/* Languages & Frameworks - Full Width */}
                <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1f2e] to-[#1e2535] border border-white/10 shadow-xl hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                                <Code2 className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {skills.categories.languages.title}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Programming languages and frameworks</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {skills.categories.languages.items.map((item, index) => (
                                <div 
                                    key={index}
                                    className="group/item relative overflow-hidden p-4 rounded-xl bg-[#252b3d] hover:bg-[#2d3447] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700" />
                                    <div className="relative flex flex-col gap-2">
                                        <span className="text-foreground font-semibold">{item.name}</span>
                                        <span className={`inline-flex w-fit px-3 py-1 text-xs rounded-full border ${levelColors[item.level] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                            {item.level}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tools & Platforms - Full Width */}
                <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1f2e] to-[#1e2535] border border-white/10 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                                <Wrench className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {skills.categories.tools.title}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">Platforms and services</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {skills.categories.tools.items.map((item, index) => {
                                const config = toolConfig[item.category] || { icon: Cloud, color: 'text-gray-400', bgColor: 'bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/20' };
                                const IconComponent = config.icon;
                                return (
                                    <div 
                                        key={index}
                                        className={`flex items-center gap-3 px-5 py-3 rounded-xl ${config.bgColor} border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                                    >
                                        <IconComponent className={`w-5 h-5 ${config.color}`} />
                                        <span className="text-foreground font-medium">{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Two Column Layout for IDE and AI */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* IDEs & Development Tools */}
                    <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-[#1a1f2e] to-[#1e2535] border border-white/10 shadow-xl hover:shadow-2xl hover:border-purple-500/30 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                                    <Terminal className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {skills.categories.ide.title}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.categories.ide.items.map((item, index) => (
                                    <span 
                                        key={index}
                                        className="px-4 py-2 text-sm rounded-lg bg-[#252b3d] text-purple-300 border border-purple-500/20 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-default hover:-translate-y-0.5"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* AI Tools */}
                    <section className="group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                        <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-[#1a1f2e] to-[#1e2535] border border-white/10 shadow-xl hover:shadow-2xl hover:border-pink-500/30 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 group-hover:from-pink-500/30 group-hover:to-rose-500/30 transition-all duration-300">
                                    <Brain className="w-6 h-6 text-pink-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {skills.categories.ai.title}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.categories.ai.items.map((item, index) => (
                                    <span 
                                        key={index}
                                        className="px-4 py-2 text-sm rounded-lg bg-[#252b3d] text-pink-300 border border-pink-500/20 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-rose-500/20 hover:border-pink-500/40 transition-all duration-300 cursor-default hover:-translate-y-0.5"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
