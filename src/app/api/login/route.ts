import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

// Strict input validation schema
const loginSchema = z.object({
    email: z.string().email("Invalid email format").max(255),
    password: z.string().min(1, "Password is required").max(128),
});

export async function POST(request: Request) {
    try {
        // 1. Parse and validate input
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        // 2. Lookup user (constant‑time safe: always compare hash)
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
        });

        // Use a real pre-computed dummy hash to prevent timing attacks when user doesn't exist
        // Generated via: bcrypt.hash('never_match_this_password_xyzzy_42', 10)
        const DUMMY_HASH =
            "$2b$10$MPxjw5mcUqRDClk.JofW9.PWNV1fFWHlRmVF6xYDncq8M2RKC1XK2";
        const hashToCompare = user?.password || DUMMY_HASH;
        const isPasswordValid = await compare(password, hashToCompare);

        if (!user || !isPasswordValid) {
            // Same generic message for both user-not-found and wrong-password
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 3. Sign JWT
        const token = await signToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json(
            {
                success: true,
                user: { id: user.id, email: user.email, role: user.role },
            },
            { status: 200 }
        );

        // 4. Set secure cookie
        const isProd = process.env.NODE_ENV === "production";
        response.cookies.set({
            name: "auth-token",
            value: token,
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
            ...(isProd && { domain: undefined }), // Let browser auto-set from origin
        });

        // 5. Prevent caching of auth responses
        response.headers.set("Cache-Control", "no-store, max-age=0");

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
