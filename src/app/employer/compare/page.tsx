'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { TrustRing } from '@/components/shared/TrustRing';
import { Button } from '@/components/shared/Button';
import { INITIAL_WORKERS } from '@/lib/db';
import { Check, ShieldCheck, MapPin, X, ArrowLeft } from 'lucide-react';

export default function CompareWorkersPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'worker-ramesh-k',
    'worker-shankar-m',
    'worker-lakshmi-p',
  ]);

  const workers = INITIAL_WORKERS.filter((w) => selectedIds.includes(w.id));

  const removeWorker = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  return (
    <EmployerShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/employer"
              className="p-2 rounded-xl bg-white border border-slate-200 text-navy-primary hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-navy-primary tracking-tight">
                Side-by-Side Talent Comparison
              </h1>
              <p className="text-xs text-content-secondary">
                Merit-based verification comparison for unbiased hiring decisions
              </p>
            </div>
          </div>

          <Link
            href="/employer"
            className="text-xs font-bold text-orange hover:underline"
          >
            + Add more workers to compare
          </Link>
        </div>

        {workers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm text-content-secondary font-medium">No candidates selected for comparison.</p>
            <Button href="/employer" variant="orange" size="md" className="mt-4">
              Explore Talent
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between relative group"
              >
                <button
                  type="button"
                  onClick={() => removeWorker(worker.id)}
                  className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-5">
                  {/* Worker Card Header */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={worker.avatarUrl}
                      alt={worker.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-navy-primary">
                          {worker.name}
                        </h3>
                        <BadgeLevel level={worker.badgeLevel} size="sm" />
                      </div>
                      <p className="text-xs text-content-secondary">
                        {worker.trade} • {worker.locality}
                      </p>
                    </div>
                  </div>

                  {/* Trust Ring */}
                  <div className="py-2 flex justify-center bg-slate-50/70 rounded-2xl border border-slate-100">
                    <TrustRing score={worker.trustScore} size={84} />
                  </div>

                  {/* Core Metrics */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Experience</span>
                      <span className="font-bold text-navy-primary">{worker.yearsOfExperience} Years</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Verified Vouches</span>
                      <span className="font-bold text-navy-primary">{worker.vouches.length} Phone-Verified</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Work Evidence</span>
                      <span className="font-bold text-navy-primary">{worker.evidence.length} Media Proofs</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Safety Aware</span>
                      <span className="font-bold text-green flex items-center gap-1">
                        {worker.safetyAware ? '✓ Certified' : 'Not yet'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Languages</span>
                      <span className="font-bold text-navy-primary">{worker.languages.join(', ')}</span>
                    </div>
                  </div>

                  {/* Verified Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-navy-primary mb-2">Verified Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.verifiedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-semibold bg-green-tint text-green-dark border border-green/30 px-2 py-0.5 rounded-full flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-green" />
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 flex gap-2">
                  <Button
                    href={`/passport/${worker.id}`}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View Passport
                  </Button>
                  <Button
                    href="/employer"
                    variant="orange"
                    size="sm"
                    className="flex-1 font-bold"
                  >
                    Hire Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EmployerShell>
  );
}
