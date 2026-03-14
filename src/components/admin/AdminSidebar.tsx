"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, CalendarDays, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDictionary } from "@/components/providers/DictionaryProvider";


export function AdminSidebar() {
    const { dict, lang } = useDictionary();
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const NAV_ITEMS = [
        { href: `/${lang}/admin`, label: dict.admin.dashboard, icon: LayoutDashboard },
        { href: `/${lang}/admin/projects`, label: dict.admin.projects, icon: FolderKanban },
        { href: `/${lang}/admin/activities`, label: dict.admin.activities, icon: CalendarDays },
    ];

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/logout", { method: "POST" });
            router.push(`/${lang}/login`);
            router.refresh();
        } catch (err) {
            console.error("Logout failed:", err);
            setIsLoggingOut(false);
        }
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#0B0F17]/90 backdrop-blur-xl border-r border-white/5 flex flex-col pt-20 z-40 hidden md:flex shadow-2xl">
            <div className="px-4 py-8 flex-1 space-y-3">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== `/${lang}/admin` && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden",
                                isActive
                                    ? "text-white bg-indigo-500/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)] border border-indigo-500/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_4px_15px_rgba(99,102,241,1)]" />
                            )}
                            <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-400" : "group-hover:text-indigo-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
            <div className="p-4 border-t border-white/5 mt-auto bg-[#111827]/50">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 disabled:opacity-50"
                >
                    {isLoggingOut ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <LogOut className="w-5 h-5" />
                    )}
                    {isLoggingOut ? dict.admin.signingOut : dict.admin.signOut}
                </button>
            </div>
        </aside>
    );
}
