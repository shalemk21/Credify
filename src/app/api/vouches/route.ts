import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateTrustScore } from '@/lib/trust';
import { Vouch } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workerId, rating, comment, vouchedByName, vouchedByPhone, workedTogether, role } = body;

    const worker = db.getWorkerById(workerId);
    if (!worker) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }

    // Safeguard 1: One vouch per referrer per worker
    const existing = worker.vouches.find((v) => v.vouchedByPhone === vouchedByPhone);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This phone number has already vouched for this worker.' },
        { status: 409 }
      );
    }

    const newVouch: Vouch = {
      id: 'vouch-' + Date.now(),
      workerId,
      vouchedByName: vouchedByName || 'Verified Client',
      vouchedByPhone: vouchedByPhone || '+91 99000 00000',
      role: role || 'Homeowner',
      rating: Math.max(1, Math.min(5, rating || 5)),
      workedTogether: workedTogether !== false,
      comment: comment || '',
      createdAt: new Date().toISOString().slice(0, 10),
      verifiedOtp: true,
    };

    const updatedVouches = [newVouch, ...worker.vouches];
    const scoreResult = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: updatedVouches,
      assessment: worker.assessment,
      assessorVerified: worker.assessorVerified,
    });

    const updatedWorker = db.updateWorker(workerId, {
      vouches: updatedVouches,
      trustScore: scoreResult.totalScore,
      badgeLevel: scoreResult.badgeLevel,
    });

    return NextResponse.json({
      success: true,
      data: {
        vouch: newVouch,
        trustScore: scoreResult.totalScore,
        badgeLevel: scoreResult.badgeLevel,
        worker: updatedWorker,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
