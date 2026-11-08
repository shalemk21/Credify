import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const worker = serverDb.getWorkerById(params.id);
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
    const updated = serverDb.updateWorker(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = serverDb.deleteWorker(params.id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Deletion failed' }, { status: 400 });
  }
}
