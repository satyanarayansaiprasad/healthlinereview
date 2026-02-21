import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    [key: string]: any;
}

export async function signToken(payload: TokenPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secretKey);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as TokenPayload;
    } catch (error) {
        return null;
    }
}

export function getAuthToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}
