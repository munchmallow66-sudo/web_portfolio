"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getDictionary, Locale } from "@/lib/i18n";
import toast from "react-hot-toast";

interface ContactPageProps {
    params: { lang: Locale };
}

export default function ContactPage({ params }: ContactPageProps) {
    const [dict, setDict] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    // Load dictionary on client side
    useEffect(() => {
        getDictionary(params.lang).then(setDict);
    }, [params.lang]);

    // For static dictionary loading
    const dictionary = require("@/lib/i18n").dictionaries[params.lang];
    const d = dictionary || dict;

    if (!d) {
        return (
            <div className="container mx-auto px-4 py-24 max-w-5xl">
                <div className="animate-pulse space-y-8">
                    <div className="h-16 bg-gray-800 rounded w-3/4" />
                    <div className="h-8 bg-gray-800 rounded w-full" />
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="h-64 bg-gray-800 rounded" />
                        <div className="h-64 bg-gray-800 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(d.contact.successMessage || "ส่งข้อความสำเร็จ!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error(d.contact.errorMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            }
        } catch {
            toast.error(d.contact.errorMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 max-w-5xl space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground">
                    {d.contact.title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground w-full max-w-3xl leading-relaxed">
                    {d.contact.description}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
                {/* Contact Info Card */}
                <div className="space-y-4 p-8 rounded-2xl bg-[#111827]/80 border border-white/10 shadow-lg backdrop-blur hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="text-sm font-bold tracking-widest text-indigo-400 uppercase mb-8 relative z-10">
                        {d.contact.directContact || "ติดต่อโดยตรง"}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-6 text-xl font-medium text-foreground relative z-10">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-300">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{d.about?.personalInfo?.labels?.email || "อีเมล"}</p>
                            <a
                                href="mailto:watchara47114145@gmail.com"
                                className="hover:text-indigo-400 transition-colors text-lg"
                            >
                                watchara47114145@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-6 text-xl font-medium text-foreground relative z-10">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-300">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{d.about?.personalInfo?.labels?.phone || "โทรศัพท์"}</p>
                            <a
                                href="tel:+66980423034"
                                className="hover:text-indigo-400 transition-colors text-lg"
                            >
                                +66 980 423 034
                            </a>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-6 text-xl font-medium text-foreground relative z-10">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-300">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{d.about?.personalInfo?.labels?.location || "ที่อยู่"}</p>
                            <span className="text-lg">กาฬสินธุ์, ประเทศไทย</span>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
                </div>

                {/* Contact Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-300 leading-none">
                            {d.contact.nameLabel}
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="flex h-14 w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-base text-white shadow-sm transition-all focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-muted-foreground/50 hover:border-white/20"
                            placeholder={d.contact.namePlaceholder}
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-300 leading-none">
                            {d.contact.emailLabel}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="flex h-14 w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-2 text-base text-white shadow-sm transition-all focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-muted-foreground/50 hover:border-white/20"
                            placeholder={d.contact.emailPlaceholder}
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="message" className="text-sm font-semibold text-gray-300 leading-none">
                            {d.contact.messageLabel}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="flex min-h-[160px] w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-4 text-base text-white shadow-sm transition-all focus-visible:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-muted-foreground/50 hover:border-white/20 resize-none"
                            placeholder={d.contact.messagePlaceholder}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-8 text-base font-bold text-white shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isLoading ? d.contact.sending || "กำลังส่ง..." : d.contact.sendMessage}
                    </button>
                </form>
            </div>
        </div>
    );
}
