'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { INITIAL_WORKERS, db } from '@/lib/db';
import { WorkerProfile } from '@/types';
import { calculateTrustScore } from '@/lib/trust';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Smartphone,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';

export default function AdminPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [statusNotice, setStatusNotice] = useState<string>('');

  const toggleAssessor = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const newStatus = !w.assessorVerified;
          const scoreBreakdown = calculateTrustScore({
            declaredSkills: w.declaredSkills,
            evidence: w.evidence,
            vouches: w.vouches,
            assessment: w.assessment,
            assessorVerified: newStatus,
          });

          return {
            ...w,
            assessorVerified: newStatus,
            trustScore: scoreBreakdown.totalScore,
            badgeLevel: scoreBreakdown.badgeLevel,
          };
        }
        return w;
      })
    );
    setStatusNotice('Assessor verification updated & trust score recalculated.');
    setTimeout(() => setStatusNotice(''), 3000);
  };

  const simulateVouch = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const newVouch = {
            id: 'vouch-sim-' + Date.now(),
            workerId: w.id,
            vouchedByName: 'Sobha Quality Auditor ' + Math.floor(Math.random() * 90 + 10),
            vouchedByPhone: '+91 99000 ' + Math.floor(Math.random() * 90000 + 10000),
            role: 'Site Supervisor' as const,
            rating: 5,
            workedTogether: true,
            comment: 'Simulated high-standard site verification vouch.',
            createdAt: new Date().toISOString().slice(0, 10),
            verifiedOtp: true,
          };
          const updatedVouches = [newVouch, ...w.vouches];
          const scoreBreakdown = calculateTrustScore({
            declaredSkills: w.declaredSkills,
            evidence: w.evidence,
            vouches: updatedVouches,
            assessment: w.assessment,
            assessorVerified: w.assessorVerified,
          });

          return {
            ...w,
            vouches: updatedVouches,
            trustScore: scoreBreakdown.totalScore,
            badgeLevel: scoreBreakdown.badgeLevel,
          };
        }
        return w;
      })
    );
    setStatusNotice('Simulated phone-verified vouch added! Trust score updated.');
    setTimeout(() => setStatusNotice(''), 3000);
  };

  const handleReset = () => {
    setWorkers([...INITIAL_WORKERS]);
    setStatusNotice('Reset all 12 workers & jobs to pristine initial demo seed.');
    setTimeout(() => setStatusNotice(''), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Logo size="md" href="/" />
            <span className="text-xs font-black bg-navy-primary text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
              Demo Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button href="/worker" variant="outline" size="sm" icon={<Smartphone className="w-4 h-4" />}>
              Worker PWA
            </Button>
            <Button href="/employer" variant="outline" size="sm" icon={<LayoutDashboard className="w-4 h-4" />}>
              Employer View
            </Button>
            <Button
              onClick={handleReset}
              variant="orange"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Demo Seed Data
            </Button>
          </div>
        </div>

        {statusNotice && (
          <div className="bg-green-tint border border-green/30 text-green-dark p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-green" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Workers List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-navy-primary">
                12 Registered Bangalore Workers
              </h2>
              <p className="text-xs text-content-secondary">
                Toggle NSDC/Assessor verification flags or inject instant vouches to verify real-time trust score telemetry
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Section 11 Spec
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Worker</th>
                  <th className="p-4">Trade & Locality</th>
                  <th className="p-4">Trust Score</th>
                  <th className="p-4">Tier Badge</th>
                  <th className="p-4">Vouches</th>
                  <th className="p-4">Assessor Verified</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-navy-primary">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={w.avatarUrl}
                        alt={w.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-extrabold text-navy-primary">{w.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{w.phone}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span>{w.trade}</span>
                      <span className="text-slate-400 block text-[10px] font-normal">{w.locality}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-black text-sm text-navy-primary">{w.trustScore}</span>
                      <span className="text-slate-400 text-[10px]"> / 100</span>
                    </td>

                    <td className="p-4">
                      <BadgeLevel level={w.badgeLevel} size="sm" />
                    </td>

                    <td className="p-4">
                      <span className="font-bold">{w.vouches.length} Verified</span>
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleAssessor(w.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          w.assessorVerified
                            ? 'bg-green-tint text-green-dark border-green/30'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {w.assessorVerified ? '✓ Verified (+10)' : 'Unverified'}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => simulateVouch(w.id)}
                          className="px-2.5 py-1 rounded-lg bg-orange-light text-orange hover:bg-orange hover:text-white border border-orange/20 font-bold text-[11px] transition-colors"
                        >
                          + Simulate Vouch
                        </button>
                        <Link
                          href={`/passport/${w.id}`}
                          target="_blank"
                          className="p-1 text-slate-400 hover:text-navy-primary"
                          title="Open passport"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
