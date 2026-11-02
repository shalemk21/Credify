import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const worker = db.getWorkerById(params.id);
  if (!worker) {
    return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: worker });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = db.updateWorker(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}
