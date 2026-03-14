/** @type {import('next').NextConfig} */
const nextConfig = {
    // ─── Image Optimization ──────────────────────────────────────
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
            },
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        unoptimized: true, // Disable image optimization for development
    },

    // ─── Production Headers ──────────────────────────────────────
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    // HTTPS enforcement
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
            // Cache immutable assets aggressively
            {
                source: "/_next/static/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/fonts/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },

    // ─── Build Optimization ──────────────────────────────────────
    poweredByHeader: false, // Remove "X-Powered-By: Next.js" header
    reactStrictMode: true,
    compress: true,

    // ─── Logging for production ──────────────────────────────────
    logging: {
        fetches: {
            fullUrl: process.env.NODE_ENV === "development",
        },
    },

    // ─── Experimental Performance ────────────────────────────────
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
};

export default nextConfig;
