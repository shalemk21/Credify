import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { workerId, status } = await request.json();
    const jobs = db.getJobs();
    const job = jobs.find((j) => j.id === params.id);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    const existingIdx = job.responses.findIndex((r) => r.workerId === workerId);
    if (existingIdx !== -1) {
      job.responses[existingIdx].status = status;
      job.responses[existingIdx].respondedAt = new Date().toISOString();
    } else {
      job.responses.push({
        workerId,
        status,
        respondedAt: new Date().toISOString(),
      });
    }

    const updated = db.updateJob(params.id, { responses: job.responses });
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}
