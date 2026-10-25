import { NextRequest, NextResponse } from 'next/server';
import { verifyBearerToken } from '@/src/server/firebaseAdmin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const verified = await verifyBearerToken(authHeader);
      if (!verified || !verified.isAdmin) {
        return NextResponse.json(
          { error: 'Forbidden: Administrator verification required.' },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { dataUrl, mimeType, sizeBytes } = body || {};
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!mimeType || !allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Please upload PNG, JPEG, WebP, or SVG.' },
        { status: 400 }
      );
    }
    if (typeof sizeBytes === 'number' && sizeBytes > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file exceeds the 4MB maximum size limit.' },
        { status: 400 }
      );
    }
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image data payload.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ imageUrl: dataUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Image upload failed.' },
      { status: 500 }
    );
  }
}
