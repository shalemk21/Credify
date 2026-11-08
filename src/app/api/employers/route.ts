import { NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { EmployerProfile } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const employers = serverDb.getEmployers();
    return NextResponse.json({ success: true, data: employers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch employers from database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEmployer: EmployerProfile = {
      id: body.id || 'emp-' + Date.now(),
      companyName: body.companyName || 'New Contractor Enterprise',
      contactPerson: body.contactPerson || 'Authorized Representative',
      type: body.type || 'contractor',
      locality: body.locality || 'Whitefield',
      phone: body.phone || '+91 99000 00000',
      email: body.email || '',
      gstin: body.gstin || '',
      verified: false,
      status: 'PENDING_APPROVAL', // New employer applications must be approved by admin!
      applicationDate: new Date().toISOString().slice(0, 10),
      shortlistedWorkerIds: [],
    };

    const saved = serverDb.addEmployer(newEmployer);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit employer application' }, { status: 400 });
  }
}

