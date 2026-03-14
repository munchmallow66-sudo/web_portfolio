"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to external service in production
        console.error("[GLOBAL_ERROR]", {
            message: error.message,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
                <div className="text-center space-y-6 px-4 max-w-md">
                    <div className="text-6xl font-bold text-red-500">500</div>
                    <h1 className="text-2xl font-semibold">Something went wrong</h1>
                    <p className="text-neutral-400">
                        An unexpected error occurred. Our team has been notified.
                    </p>
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-md bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
