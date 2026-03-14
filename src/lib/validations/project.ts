import { z } from "zod";

// Strict sanitization: no HTML or script tags allowed
const sanitizedString = (fieldName: string) =>
    z
        .string()
        .min(1, `${fieldName} is required`)
        .max(5000, `${fieldName} is too long`)
        .refine(
            (val) => !/<script/i.test(val) && !/<\/?[a-z][\s\S]*>/i.test(val),
            { message: `${fieldName} contains disallowed HTML content` }
        );

const safeUrl = z
    .string()
    .url("Invalid URL format")
    .max(2048, "URL is too long")
    .refine(
        (val) => /^https?:\/\//.test(val),
        { message: "Only http and https URLs are allowed" }
    )
    .optional()
    .or(z.literal("").transform(() => undefined))
    .nullable();

export const projectSchema = z.object({
    title: sanitizedString("Title").pipe(z.string().max(200)),
    shortDescription: sanitizedString("Short description").pipe(z.string().max(500)),
    fullDescription: sanitizedString("Full description"),
    techStack: z
        .array(z.string().max(50).trim())
        .max(20, "Too many tech stack items")
        .default([]),
    tags: z
        .array(z.string().max(50).trim())
        .max(20, "Too many tags")
        .default([]),
    githubUrl: safeUrl,
    liveUrl: safeUrl,
    featured: z.boolean().default(false),
    images: z
        .array(
            z
                .string()
                .url("Invalid image URL")
                .max(2048)
                .refine(
                    (url) => /^https?:\/\//.test(url),
                    { message: "Only http/https image URLs are allowed" }
                )
        )
        .max(10, "Maximum 10 images allowed")
        .default([]),
});
