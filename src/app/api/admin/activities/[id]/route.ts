import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { activitySchema } from "@/lib/validations/activity";
import { uploadMultipleImages } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 10;

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
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
                description: formData.get("description") || "",
                date: formData.get("date") || "",
                location: formData.get("location") || undefined,
                category: formData.get("category") || undefined,
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

        // Zod Validation
        const validatedData = activitySchema.parse(body);

        // Update activity
        const activity = await prisma.activity.update({
            where: { id },
            data: {
                title: validatedData.title,
                description: validatedData.description,
                date: new Date(validatedData.date),
                location: validatedData.location,
                category: validatedData.category,
                images: {
                    deleteMany: {},
                    create: validatedData.images?.map((url) => ({ url })) || [],
                },
            },
            select: {
                id: true,
                slug: true,
                title: true,
                updatedAt: true,
            },
        });

        const response = NextResponse.json(activity);
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error: any) {
        console.error("[ACTIVITY_PUT]", error);

        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
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
        const { id } = params;

        await prisma.activity.delete({
            where: { id },
        });

        const response = NextResponse.json(
            { message: "Activity deleted successfully" },
            { status: 200 }
        );
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (error: any) {
        console.error("[ACTIVITY_DELETE]", error);

        if (error.code === "P2025") {
            return NextResponse.json(
                { error: "Activity not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
