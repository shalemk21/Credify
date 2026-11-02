import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { JobRequest } from '@/types';

export async function GET() {
  const jobs = db.getJobs();
  return NextResponse.json({ success: true, data: jobs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newJob: JobRequest = {
      id: 'job-' + Date.now(),
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
      responses: [],
    };

    const saved = db.addJob(newJob);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 400 });
  }
}
