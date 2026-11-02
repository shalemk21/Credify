'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { MatchRing } from '@/components/shared/MatchRing';
import { Button } from '@/components/shared/Button';
import { INITIAL_WORKERS } from '@/lib/db';
import { Bookmark, Send, ExternalLink, MapPin, Trash2 } from 'lucide-react';

export default function EmployerShortlistPage() {
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([
    'worker-ramesh-k',
    'worker-lakshmi-p',
  ]);

  const workers = INITIAL_WORKERS.filter((w) => shortlistedIds.includes(w.id));

  const removeShortlist = (id: string) => {
    setShortlistedIds((prev) => prev.filter((i) => i !== id));
  };

  return (
    <EmployerShell>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-navy-primary tracking-tight">
              Shortlisted Talent
            </h1>
            <p className="text-xs text-content-secondary">
              Review and contact candidates you have saved for active site openings
            </p>
          </div>
          <Button href="/employer" variant="outline" size="sm">
            ← Search More
          </Button>
        </div>

        {workers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm text-content-secondary font-medium">Your shortlist is currently empty.</p>
            <Button href="/employer" variant="orange" size="md" className="mt-4">
              Explore Talent
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={worker.avatarUrl}
                      alt={worker.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-navy-primary">
                          {worker.name}
                        </h3>
                        <BadgeLevel level={worker.badgeLevel} size="sm" />
                      </div>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {worker.trade} • {worker.locality}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                        <span>{worker.yearsOfExperience} yrs exp</span>
                        <span>•</span>
                        <span>{worker.vouches.length} vouches</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeShortlist(worker.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/passport/${worker.id}`}
                    target="_blank"
                    className="text-xs font-bold text-navy-primary flex items-center gap-1 hover:underline"
                  >
                    <span>View Passport</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Button href="/employer" variant="orange" size="sm">
                    Send Hire Request
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
