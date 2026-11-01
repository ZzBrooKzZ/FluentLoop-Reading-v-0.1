import { NextRequest, NextResponse } from 'next/server';
import { requireVerifiedAdminAuth } from '@/src/server/firebaseAdmin';
import { readJsonBodyWithLimit } from '@/src/server/placementToken';

export const runtime = 'nodejs';

// Maximum request payload size (5 MB) enforced before JSON parsing
const MAX_UPLOAD_REQUEST_BYTES = 5 * 1024 * 1024;

// Maximum raw file size for inline data-URL storage (700 KB raw -> ~933 KB base64, safely under Firestore's 1 MiB document limit)
const MAX_INLINE_IMAGE_BYTES = 700 * 1024;

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireVerifiedAdminAuth(req.headers.get('authorization'));
    if (!authCheck.ok) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const parsed = await readJsonBodyWithLimit<any>(req, MAX_UPLOAD_REQUEST_BYTES);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    const body = parsed.data;
    const { dataUrl, mimeType, sizeBytes } = body || {};
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!mimeType || !allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Please upload PNG, JPEG, WebP, or SVG.' },
        { status: 400 }
      );
    }
    if (typeof sizeBytes === 'number' && sizeBytes > MAX_INLINE_IMAGE_BYTES) {
      return NextResponse.json(
        {
          error:
            'Image file exceeds the 700KB inline storage limit for Firestore documents. Please compress the image or use SVG/WebP.',
        },
        { status: 400 }
      );
    }
    if (
      !dataUrl ||
      typeof dataUrl !== 'string' ||
      !dataUrl.startsWith('data:image/') ||
      dataUrl.length > 950_000
    ) {
      return NextResponse.json(
        { error: 'Invalid or oversized image data payload.' },
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
