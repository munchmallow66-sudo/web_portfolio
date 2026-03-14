import { SignJWT, jwtVerify } from "jose";

export type AuthPayload = {
    id: string;
    email: string;
    role: string;
};

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return new TextEncoder().encode(secret);
};

export async function signToken(payload: AuthPayload) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d") // Token expires in 1 day
        .sign(getJwtSecretKey());
    return token;
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        return payload as AuthPayload;
    } catch (error) {
        // If token verification fails (e.g., expired or invalid signature), return null
        return null;
    }
}
