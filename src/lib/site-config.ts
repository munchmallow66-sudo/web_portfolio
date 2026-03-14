const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourportfolio.com";

/**
 * ⚠️ IMPORTANT: Replace ALL placeholder values below before deploying to production.
 *    Search for "REPLACE_ME" to find values that need updating.
 */
export const siteConfig = {
    name: "Premium Dev Portfolio", // REPLACE_ME: Your portfolio name
    description:
        "Senior Developer Portfolio — Crafting scalable web applications with modern technologies, focusing on performance, accessibility, and exceptional user experiences.",
    url: SITE_URL,
    ogImage: `${SITE_URL}/og-image.png`,
    author: {
        name: "Watchara Ponchai", // REPLACE_ME: Your real name
        url: SITE_URL,
        email: "watchara47114145@gmail.com", // REPLACE_ME: Your email
        twitter: "@yourhandle", // REPLACE_ME: Your Twitter/X handle
    },
    links: {
        github: "https://github.com/yourgithub", // REPLACE_ME: Your GitHub URL
        linkedin: "https://linkedin.com/in/yourlinkedin", // REPLACE_ME: Your LinkedIn URL
        twitter: "https://twitter.com/yourhandle", // REPLACE_ME: Your Twitter/X URL
    },
} as const;
