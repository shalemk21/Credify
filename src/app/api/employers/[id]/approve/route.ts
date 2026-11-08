import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const employerId = params.id;
    const body = await request.json();
    const { action, adminName = 'Credify Directorate Admin', reason } = body;

    if (action === 'approve') {
      const updated = serverDb.approveEmployer(employerId, adminName);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Employer not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Employer application approved successfully' });
    } else if (action === 'reject') {
      const updated = serverDb.rejectEmployer(employerId, adminName, reason);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Employer not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated, message: 'Employer application rejected' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action. Expected "approve" or "reject"' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process employer approval' }, { status: 500 });
  }
}
