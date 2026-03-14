"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[PAGE_ERROR]", {
            message: error.message,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
            <div className="text-6xl font-bold text-destructive">Error</div>
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-md">
                We encountered an unexpected error loading this page. Please try again
                or go back to the homepage.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
