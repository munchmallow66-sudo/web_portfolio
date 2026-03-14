import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard | Portfolio",
    robots: "noindex, nofollow", // Keep admin out of search engines
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0B0F17] text-foreground pt-16">
            <AdminSidebar />
            <main className="flex-1 md:pl-64 overflow-y-auto w-full p-4 md:p-8">
                <div className="mx-auto max-w-6xl bg-[#111827]/40 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl p-8 min-h-[calc(100vh-8rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
}
