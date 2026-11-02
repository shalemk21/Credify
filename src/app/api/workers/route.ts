import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const workers = db.getWorkers();
  return NextResponse.json({ success: true, data: workers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = db.addWorker(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
