import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { getDictionary, Locale } from "@/lib/i18n";
import { Briefcase, GraduationCap, User, Calendar, MapPin, Mail, Phone, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn more about my background, skills, and professional experience as a software engineer.",
    openGraph: {
        title: "About",
        description: "Learn more about my background, skills, and experience.",
        url: `${siteConfig.url}/about`,
    },
};

function AboutPageJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About",
        description: "Professional profile and experience.",
        url: `${siteConfig.url}/about`,
        mainEntity: {
            "@type": "Person",
            name: siteConfig.author.name,
            url: siteConfig.url,
            sameAs: [
                siteConfig.links.github,
                siteConfig.links.linkedin,
                siteConfig.links.twitter,
            ],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function AboutPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    const personalInfoItems = [
        { icon: User, label: dict.about.personalInfo.labels.name, value: dict.about.personalInfo.name },
        { icon: Calendar, label: dict.about.personalInfo.labels.birthdate, value: dict.about.personalInfo.birthdate },
        { icon: MapPin, label: dict.about.personalInfo.labels.location, value: dict.about.personalInfo.location },
        { icon: Mail, label: dict.about.personalInfo.labels.email, value: dict.about.personalInfo.email },
        { icon: Phone, label: dict.about.personalInfo.labels.phone, value: dict.about.personalInfo.phone },
        { icon: Globe, label: dict.about.personalInfo.labels.language, value: dict.about.personalInfo.language },
    ];

    return (
        <>
            <AboutPageJsonLd />
            <div className="container mx-auto px-4 py-24 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Page Title */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {dict.about.title}
                    </h1>
                </div>

                {/* Personal Info & Summary Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Personal Info Card */}
                    <div className="p-8 rounded-2xl bg-[#1a1f2e] border border-white/10 shadow-lg">
                        <div className="space-y-6">
                            {personalInfoItems.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-indigo-500/10">
                                        <item.icon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                                        <p className="text-foreground font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">
                                {dict.about.summary.title}
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                {dict.about.description.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-12 pt-4 border-t border-white/10">
                            <div>
                                <p className="text-4xl font-bold text-indigo-400">4+</p>
                                <p className="text-sm text-muted-foreground mt-1">{dict.about.stats.experience}</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-indigo-400">6+</p>
                                <p className="text-sm text-muted-foreground mt-1">{dict.about.stats.projects}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work & Education Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                        {dict.about.executiveExperience}
                    </h2>
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Experience Card */}
                    <div className="relative">
                        {/* Section Header with Icon */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-indigo-500/20">
                                <Briefcase className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {dict.about.experienceTitle}
                            </h3>
                        </div>

                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-16 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-indigo-500/50 to-transparent" />

                        {/* Experience Card */}
                        <div className="relative ml-12">
                            {/* Timeline dot */}
                            <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                            
                            <div className="p-6 rounded-2xl bg-[#1a1f2e] border border-white/10 shadow-lg">
                                <h4 className="text-xl font-bold text-foreground mb-2">
                                    {dict.about.experience.title}
                                </h4>
                                
                                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-500/20 text-indigo-300 mb-3">
                                    {dict.about.experience.duration}
                                </span>
                                
                                <p className="text-muted-foreground mb-4">
                                    {dict.about.experience.company}
                                </p>
                                
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {dict.about.experience.description}
                                </p>
                                
                                {/* Skills */}
                                <div className="flex flex-wrap gap-2">
                                    {dict.about.experience.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 text-sm rounded-full bg-[#252b3d] text-indigo-300 border border-indigo-500/30"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education Card */}
                    <div className="relative">
                        {/* Section Header with Icon */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <GraduationCap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {dict.about.educationTitle}
                            </h3>
                        </div>

                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-16 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-blue-500/50 to-transparent" />

                        {/* Education Card */}
                        <div className="relative ml-12">
                            {/* Timeline dot */}
                            <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            
                            <div className="p-6 rounded-2xl bg-[#1a1f2e] border border-white/10 shadow-lg">
                                <h4 className="text-xl font-bold text-foreground mb-2">
                                    {dict.about.education.title}
                                </h4>
                                
                                <p className="text-muted-foreground mb-4">
                                    {dict.about.education.faculty}
                                </p>
                                
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    {dict.about.education.description}
                                </p>
                                
                                {/* Skills */}
                                <div className="flex flex-wrap gap-2">
                                    {dict.about.education.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 text-sm rounded-full bg-[#252b3d] text-blue-300 border border-blue-500/30"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
