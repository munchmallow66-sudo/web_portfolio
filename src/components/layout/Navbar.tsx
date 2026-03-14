"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Locale, locales, defaultLocale } from "@/lib/i18n";

const NAV_LINKS_MAP: Record<Locale, { name: string; path: string }[]> = {
    th: [
        { name: "หน้าแรก", path: "" },
        { name: "เกี่ยวกับ", path: "/about" },
        { name: "ผลงาน", path: "/projects" },
        { name: "ทักษะ", path: "/skills" },
        { name: "กิจกรรม", path: "/activities" },
        { name: "ติดต่อ", path: "/contact" },
    ],
    en: [
        { name: "Home", path: "" },
        { name: "About", path: "/about" },
        { name: "Projects", path: "/projects" },
        { name: "Skills", path: "/skills" },
        { name: "Activities", path: "/activities" },
        { name: "Contact", path: "/contact" },
    ]
};

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    const currentLang = (pathname.split('/')[1] as Locale) || defaultLocale;
    const isValidLang = locales.includes(currentLang);
    const lang = isValidLang ? currentLang : defaultLocale;
    const navLinks = NAV_LINKS_MAP[lang];

    // Track scroll for glass effect
    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when navigating
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent hydration mismatch by rendering placeholder during SSR
    if (!mounted) {
        return (
            <header className="fixed top-0 inset-x-0 z-50 bg-transparent border-b border-transparent">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl tracking-tighter">PORTFOLIO<span className="text-destructive">.</span></span>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
                    : "bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href={`/${lang}`}
                            className="group flex items-center gap-2 font-bold text-xl tracking-tighter"
                        >
                            <Image
                                src="/logo.png"
                                alt="Portfolio Logo"
                                width={48}
                                height={48}
                                className="object-contain w-12 h-12"
                            />
                            <span>
                                PORTFOLIO
                                <span className="text-destructive">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const linkPath = `/${lang}${link.path}`;
                            const isActive =
                                pathname === linkPath ||
                                (pathname.startsWith(`${linkPath}/`) && link.path !== "");
                            return (
                                <Link
                                    key={link.path}
                                    href={linkPath}
                                    className={cn(
                                        "relative px-5 py-2 text-sm font-medium transition-colors rounded-lg",
                                        isActive
                                            ? "text-foreground bg-indigo-500/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {link.name}
                                        {isActive && (
                                            <Sparkles className="w-3 h-3 text-indigo-500" />
                                        )}
                                    </span>
                                </Link>
                            );
                        })}
                        <div className="pl-6 ml-2 border-l border-border h-6 flex items-center gap-4">
                            <LanguageSwitcher currentLang={lang} />
                            <ThemeToggle />
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-4">
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navLinks.map((link) => {
                            const linkPath = `/${lang}${link.path}`;
                            const isActive =
                                pathname === linkPath ||
                                (pathname.startsWith(`${linkPath}/`) && link.path !== "");
                            return (
                                <Link
                                    key={link.path}
                                    href={linkPath}
                                    className={cn(
                                        "block px-4 py-3 rounded-lg text-base font-medium transition-all",
                                        isActive
                                            ? "bg-indigo-500/10 text-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <span className="flex items-center justify-between">
                                        {link.name}
                                        {isActive && (
                                            <Sparkles className="w-4 h-4 text-indigo-500" />
                                        )}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}
