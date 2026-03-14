import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { success: true, message: "Logged out successfully" },
        { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.set({
        name: "auth-token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
    });

    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
}
