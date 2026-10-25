import { NextResponse } from 'next/server';
import { getHealthStatusPayload } from '@/src/server/gradingEngine';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getHealthStatusPayload());
}
