import prisma from "./prisma";

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\u0E00-\u0E7F\-]+/g, "") // Allow Thai characters in slug
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}

export async function generateUniqueSlug(title: string, currentId?: string): Promise<string> {
    const baseSlug = slugify(title) || "project";
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        // Check in Project table
        const existingProject = await prisma.project.findUnique({
            where: { slug },
            select: { id: true },
        });

        // Check in Activity table
        const existingActivity = await prisma.activity.findUnique({
            where: { slug },
            select: { id: true },
        });

        const existing = existingProject || existingActivity;

        if (!existing) {
            return slug;
        }

        if (currentId && existing.id === currentId) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}
