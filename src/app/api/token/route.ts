import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = 'your-secret-key';
const tokenStore = new Map<string, { token: string; expiresAt: number }>();

// 获取 Token
export async function POST(request: NextRequest) {
    try {
        const { expiry = 3600 } = await request.json();
        const tokenId = uuidv4();
        const expiresAt = Date.now() + expiry * 1000;
        
        const token = jwt.sign({ id: tokenId }, JWT_SECRET, { expiresIn: expiry });
        
        tokenStore.set(tokenId, { token, expiresAt });
        
        return NextResponse.json({ token, expiresAt });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate token' },
            { status: 500 }
        );
    }
}

// 验证 Token
export async function PUT(request: NextRequest) {
    try {
        const { token } = await request.json();
        
        if (!token) {
            return NextResponse.json(
                { valid: false, message: 'Token is required' },
                { status: 400 }
            );
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const tokenInfo = tokenStore.get(decoded.id);
        
        if (!tokenInfo) {
            return NextResponse.json(
                { valid: false, message: 'Token not found' },
                { status: 401 }
            );
        }
        
        if (tokenInfo.expiresAt < Date.now()) {
            return NextResponse.json(
                { valid: false, message: 'Token expired' },
                { status: 401 }
            );
        }
        
        return NextResponse.json({ valid: true, expiresAt: tokenInfo.expiresAt });
    } catch (error) {
        return NextResponse.json(
            { valid: false, message: 'Invalid token' },
            { status: 401 }
        );
    }
}

// 删除 Token
export async function DELETE(request: NextRequest) {
    try {
        const { token } = await request.json();
        
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Token is required' },
                { status: 400 }
            );
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        tokenStore.delete(decoded.id);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid token' },
            { status: 400 }
        );
    }
}