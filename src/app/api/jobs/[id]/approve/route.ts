import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    const body = await request.json();
    const { action, adminName = 'Credify Directorate Admin', reason } = body;

    if (action === 'approve') {
      const updated = serverDb.approveJob(jobId, adminName);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Job application not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Job application approved and dispatched' });
    } else if (action === 'reject') {
      const updated = serverDb.rejectJob(jobId, adminName, reason);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Job application not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Job application rejected' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action. Expected "approve" or "reject"' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process job approval' }, { status: 500 });
  }
}
