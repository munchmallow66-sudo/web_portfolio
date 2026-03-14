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

export const activitySchema = z.object({
    title: sanitizedString("Title").pipe(z.string().max(200)),
    description: sanitizedString("Description"),
    date: z.string().min(1, "Date is required"),
    location: z
        .string()
        .max(200, "Location must be less than 200 characters")
        .optional()
        .or(z.literal("").transform(() => undefined)),
    category: z
        .string()
        .max(100, "Category must be less than 100 characters")
        .optional()
        .or(z.literal("").transform(() => undefined)),
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

export type ActivityFormData = z.infer<typeof activitySchema>;
