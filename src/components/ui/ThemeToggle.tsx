"use client";

import * as React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Placeholder to prevent hydration mismatch layout shift
    if (!mounted) {
        return <div className={cn("w-16 h-8 rounded-full", className)} />;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 overflow-hidden",
                className
            )}
            style={{
                background: isDark
                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)"
                    : "linear-gradient(135deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%)",
            }}
            aria-label="Toggle theme"
        >
            {/* Stars (visible in dark mode) */}
            <span
                className="absolute transition-opacity duration-500"
                style={{
                    opacity: isDark ? 1 : 0,
                    top: "6px",
                    left: "10px",
                    width: "2px",
                    height: "2px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    boxShadow: "8px 4px 0 0 #fff, 4px 14px 0 0 #fff, 18px 2px 0 0 rgba(255,255,255,0.6), 24px 10px 0 0 rgba(255,255,255,0.4), 14px 8px 0 0 rgba(255,255,255,0.8)",
                    animation: isDark ? "twinkle 2s ease-in-out infinite alternate" : "none",
                }}
            />

            {/* Clouds (visible in light mode) */}
            <span
                className="absolute transition-all duration-500"
                style={{
                    opacity: isDark ? 0 : 0.8,
                    bottom: "4px",
                    right: "8px",
                    width: "12px",
                    height: "6px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    boxShadow: "6px -2px 0 1px rgba(255,255,255,0.7), -4px 0 0 0 rgba(255,255,255,0.6)",
                }}
            />

            {/* Toggle knob with Sun/Moon */}
            <span
                className="flex items-center justify-center rounded-full shadow-lg transition-all duration-500 ease-in-out z-10 relative"
                style={{
                    width: "24px",
                    height: "24px",
                    transform: isDark ? "translateX(32px)" : "translateX(0px)",
                    background: isDark
                        ? "linear-gradient(135deg, #c4b5fd, #e2e8f0)"
                        : "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    boxShadow: isDark
                        ? "0 0 10px rgba(196, 181, 253, 0.5), inset -3px -2px 0 0 #94a3b8"
                        : "0 0 12px rgba(251, 191, 36, 0.6)",
                }}
            >
                {/* Sun rays (visible in light mode) */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="absolute transition-all duration-500"
                    style={{
                        width: "14px",
                        height: "14px",
                        opacity: isDark ? 0 : 1,
                        transform: isDark ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                    }}
                >
                    <circle cx="12" cy="12" r="4" fill="#fff" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </span>
        </button>
    );
}
