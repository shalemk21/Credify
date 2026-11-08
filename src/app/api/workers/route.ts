import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const workers = serverDb.getWorkers();
    return NextResponse.json({ success: true, data: workers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch workers from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = serverDb.addWorker(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid worker payload' }, { status: 400 });
  }
}
