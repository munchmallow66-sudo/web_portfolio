import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";
import { generateUniqueSlug } from "@/lib/slug";
import { uploadMultipleImages } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 10;

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type") || "";
        let body: any;
        let imageFiles: File[] = [];

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            // Extract File objects with size validation
            const rawFiles = formData
                .getAll("images")
                .filter((f) => f instanceof File && f.size > 0) as File[];

            // Validate file sizes
            for (const file of rawFiles) {
                if (file.size > MAX_FILE_SIZE) {
                    return NextResponse.json(
                        { error: `File "${file.name}" exceeds 5MB limit` },
                        { status: 400 }
                    );
                }
                // Validate MIME type
                if (!file.type.startsWith("image/")) {
                    return NextResponse.json(
                        { error: `File "${file.name}" is not an image` },
                        { status: 400 }
                    );
                }
            }

            if (rawFiles.length > MAX_FILES) {
                return NextResponse.json(
                    { error: `Maximum ${MAX_FILES} images allowed` },
                    { status: 400 }
                );
            }

            imageFiles = rawFiles;

            body = {
                title: formData.get("title") || "",
                shortDescription: formData.get("shortDescription") || "",
                fullDescription: formData.get("fullDescription") || "",
                techStack: formData.getAll("techStack") as string[],
                tags: formData.getAll("tags") as string[],
                githubUrl: formData.get("githubUrl") || undefined,
                liveUrl: formData.get("liveUrl") || undefined,
                featured: formData.get("featured") === "true",
                images: formData
                    .getAll("images")
                    .filter((f) => typeof f === "string") as string[],
            };
        } else {
            try {
                body = await request.json();
            } catch {
                return NextResponse.json(
                    { error: "Invalid JSON body" },
                    { status: 400 }
                );
            }
        }

        // Cloudinary Upload
        if (imageFiles.length > 0) {
            const uploadedUrls = await uploadMultipleImages(imageFiles);
            body.images = [...(body.images || []), ...uploadedUrls];
        }

        // Zod Validation (now includes sanitization)
        const validatedData = projectSchema.parse(body);

        // Slug Generator
        const slug = await generateUniqueSlug(validatedData.title);

        // Transaction Safety
        const project = await prisma.$transaction(async (tx: any) => {
            const newProject = await tx.project.create({
                data: {
                    title: validatedData.title,
                    slug,
                    shortDescription: validatedData.shortDescription,
                    fullDescription: validatedData.fullDescription,
                    techStack: validatedData.techStack,
                    tags: validatedData.tags,
                    githubUrl: validatedData.githubUrl,
                    liveUrl: validatedData.liveUrl,
                    featured: validatedData.featured,
                    images: {
                        create: validatedData.images.map((url) => ({ url })),
                    },
                    analytics: {
                        create: { views: 0 },
                    },
                },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    createdAt: true,
                },
            });

            return newProject;
        });

        const response = NextResponse.json(project, { status: 201 });
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error: any) {
        console.error("[PROJECT_POST]", error);

        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
