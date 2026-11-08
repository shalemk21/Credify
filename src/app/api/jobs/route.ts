import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { JobRequest } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const jobs = serverDb.getJobs();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch job requests from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob: JobRequest = {
      id: body.id || 'job-' + Date.now(),
      employerId: body.employerId || 'emp-abc',
      employerName: body.employerName || 'ABC Contractors, Bengaluru',
      trade: body.trade || 'ELECTRICIAN',
      locality: body.locality || 'Whitefield',
      requiredWorkers: body.requiredWorkers || 1,
      duration: body.duration || '3 Days',
      dailyWageOffer: body.dailyWageOffer || 1200,
      description: body.description || '',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'open',
      // If employer is creating the application, it has to be approved by admin!
      approvalStatus: 'PENDING_ADMIN_APPROVAL',
      targetWorkerId: body.targetWorkerId || undefined,
      targetWorkerName: body.targetWorkerName || undefined,
      responses: body.responses || [],
    };

    const saved = serverDb.addJob(newJob);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create job application' }, { status: 400 });
  }
}
