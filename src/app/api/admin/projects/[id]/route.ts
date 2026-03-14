import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";
import { generateUniqueSlug } from "@/lib/slug";
import { uploadMultipleImages } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 10;

// Validate ID param format (CUID/UUID patterns)
const idParamSchema = z.string().min(1).max(128).regex(
    /^[a-zA-Z0-9_-]+$/,
    "Invalid ID format"
);

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Validate ID parameter
        const idResult = idParamSchema.safeParse(params.id);
        if (!idResult.success) {
            return NextResponse.json(
                { error: "Invalid project ID" },
                { status: 400 }
            );
        }
        const id = idResult.data;

        const contentType = request.headers.get("content-type") || "";
        let body: any;
        let imageFiles: File[] = [];

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            const rawFiles = formData
                .getAll("images")
                .filter((f) => f instanceof File && f.size > 0) as File[];

            // Validate file sizes and MIME types
            for (const file of rawFiles) {
                if (file.size > MAX_FILE_SIZE) {
                    return NextResponse.json(
                        { error: `File "${file.name}" exceeds 5MB limit` },
                        { status: 400 }
                    );
                }
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

        const validatedData = projectSchema.parse(body);

        const existingProject = await prisma.project.findUnique({
            where: { id },
            select: { id: true, title: true, slug: true },
        });

        if (!existingProject) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        let nextSlug = existingProject.slug;
        if (existingProject.title !== validatedData.title) {
            nextSlug = await generateUniqueSlug(
                validatedData.title,
                existingProject.id
            );
        }

        const updatedProject = await prisma.$transaction(async (tx: any) => {
            await tx.projectImage.deleteMany({
                where: { projectId: id },
            });

            const project = await tx.project.update({
                where: { id },
                data: {
                    title: validatedData.title,
                    slug: nextSlug,
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
                },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    updatedAt: true,
                },
            });

            return project;
        });

        const response = NextResponse.json(updatedProject);
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error: any) {
        console.error("[PROJECT_PUT]", error);

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Validate ID parameter
        const idResult = idParamSchema.safeParse(params.id);
        if (!idResult.success) {
            return NextResponse.json(
                { error: "Invalid project ID" },
                { status: 400 }
            );
        }
        const id = idResult.data;

        const project = await prisma.project.findUnique({
            where: { id },
            select: { id: true }, // Minimal select
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        await prisma.project.delete({
            where: { id },
        });

        const response = NextResponse.json({
            success: true,
            message: "Project deleted successfully",
        });
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error) {
        console.error("[PROJECT_DELETE]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
