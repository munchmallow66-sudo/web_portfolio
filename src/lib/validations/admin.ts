import * as z from "zod";

export const adminProjectSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    shortDescription: z.string().min(10, "Provide a better short description"),
    fullDescription: z.string().min(20, "Provide a more detailed full description"),
    techStack: z.string().min(1, "At least one tech is required (comma separated)").transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
    tags: z.string().optional().transform((val) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
    githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    featured: z.boolean().default(false),
    images: z.any().optional(), // File list managed by form, handled dynamically
    existingImages: z.array(z.string()).optional().default([]),
});

export type AdminProjectFormValues = z.input<typeof adminProjectSchema>;
export type AdminProjectFormOutput = z.output<typeof adminProjectSchema>;
