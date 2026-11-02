'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { INITIAL_WORKERS, db } from '@/lib/db';
import { WorkerProfile, Vouch } from '@/types';
import { calculateTrustScore } from '@/lib/trust';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Smartphone,
  LayoutDashboard,
  ExternalLink,
  Trash2,
  ShieldAlert,
  MessageSquareX,
  X,
  Star,
  UserX,
  AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [statusNotice, setStatusNotice] = useState<string>('');
  
  // Vouch Moderation modal state
  const [moderatingWorker, setModeratingWorker] = useState<WorkerProfile | null>(null);

  // Delete confirmation modal state
  const [deletingWorker, setDeletingWorker] = useState<WorkerProfile | null>(null);

  // Initialize workers from db
  useEffect(() => {
    setWorkers(db.getWorkers());
  }, []);

  const toggleAssessor = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    const newStatus = !worker.assessorVerified;
    const scoreBreakdown = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: worker.vouches,
      assessment: worker.assessment,
      assessorVerified: newStatus,
    });

    const updated = db.updateWorker(workerId, {
      assessorVerified: newStatus,
      trustScore: scoreBreakdown.totalScore,
      badgeLevel: scoreBreakdown.badgeLevel,
    });

    if (updated) {
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
      setStatusNotice(`Assessor verification for ${worker.name} updated. Trust score recalculated.`);
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  const handleStatusChange = (workerId: string, newStatus: 'active' | 'flagged' | 'suspended') => {
    const updated = db.setWorkerStatus(workerId, newStatus);
    if (updated) {
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
      setStatusNotice(`Account status updated to ${newStatus.toUpperCase()}.`);
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  const handleDeleteWorker = () => {
    if (!deletingWorker) return;
    const id = deletingWorker.id;
    const name = deletingWorker.name;
    const success = db.deleteWorker(id);
    if (success) {
      setWorkers((prev) => prev.filter((w) => w.id !== id));
      setStatusNotice(`Worker profile for ${name} has been removed from the registry.`);
      setDeletingWorker(null);
      setTimeout(() => setStatusNotice(''), 3500);
    }
  };

  const handleRemoveVouch = (workerId: string, vouchId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    const updatedVouches = worker.vouches.filter((v) => v.id !== vouchId);
    const scoreBreakdown = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: updatedVouches,
      assessment: worker.assessment,
      assessorVerified: worker.assessorVerified,
    });

    const updated = db.updateWorker(workerId, {
      vouches: updatedVouches,
      trustScore: scoreBreakdown.totalScore,
      badgeLevel: scoreBreakdown.badgeLevel,
    });

    if (updated) {
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
      setModeratingWorker(updated);
      setStatusNotice('Fraudulent/spam vouch removed and trust score recalculated.');
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  const simulateVouch = (workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    const newVouch: Vouch = {
      id: 'vouch-sim-' + Date.now(),
      workerId: worker.id,
      vouchedByName: 'Sobha Quality Auditor ' + Math.floor(Math.random() * 90 + 10),
      vouchedByPhone: '+91 99000 ' + Math.floor(Math.random() * 90000 + 10000),
      role: 'Site Supervisor',
      rating: 5,
      workedTogether: true,
      comment: 'Simulated high-standard site verification vouch.',
      createdAt: new Date().toISOString().slice(0, 10),
      verifiedOtp: true,
    };
    const updatedVouches = [newVouch, ...worker.vouches];
    const scoreBreakdown = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: updatedVouches,
      assessment: worker.assessment,
      assessorVerified: worker.assessorVerified,
    });

    const updated = db.updateWorker(workerId, {
      vouches: updatedVouches,
      trustScore: scoreBreakdown.totalScore,
      badgeLevel: scoreBreakdown.badgeLevel,
    });

    if (updated) {
      setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
      setStatusNotice('Simulated phone-verified vouch added! Trust score updated.');
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  const handleReset = () => {
    db.resetToDemo();
    setWorkers(db.getWorkers());
    setStatusNotice('Reset all workers & jobs to pristine initial demo seed.');
    setTimeout(() => setStatusNotice(''), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Physical Back Button (Requirement 7) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/employer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-navy-primary shadow-xs transition-colors"
              title="Return to Employer Dashboard"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <Logo size="md" href="/" />
            <span className="text-xs font-black bg-navy-primary text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
              Admin & Trust Control Panel
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
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
              Reset Seed Data
            </Button>
          </div>
        </div>

        {statusNotice && (
          <div className="bg-green-tint border border-green/30 text-green-dark p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Workers List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-navy-primary">
                National Skill Register — Worker Moderation
              </h2>
              <p className="text-xs text-content-secondary">
                Moderate fraud, audit assessor certifications, manage vouches, or purge worker records
              </p>
            </div>
            <span className="text-xs font-bold text-navy-primary bg-slate-100 px-3 py-1 rounded-full">
              {workers.length} Registered Workers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Worker</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Trade & Locality</th>
                  <th className="p-4">Trust Score</th>
                  <th className="p-4">Tier Badge</th>
                  <th className="p-4">Vouches</th>
                  <th className="p-4">Assessor Verified</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-navy-primary">
                {workers.map((w) => {
                  const currentStatus = w.status || 'active';

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Avatar & Worker Info */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={w.avatarUrl}
                          alt={w.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <p className="font-extrabold text-navy-primary text-sm">{w.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{w.phone}</p>
                        </div>
                      </td>

                      {/* Account Status Toggle (Requirement 6) */}
                      <td className="p-4">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              w.id,
                              e.target.value as 'active' | 'flagged' | 'suspended'
                            )
                          }
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            currentStatus === 'active'
                              ? 'bg-green-tint text-green-dark border-green/30'
                              : currentStatus === 'flagged'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="flagged">Flagged ⚠️</option>
                          <option value="suspended">Suspended 🚫</option>
                        </select>
                      </td>

                      {/* Trade & Locality */}
                      <td className="p-4">
                        <span>{w.trade}</span>
                        <span className="text-slate-400 block text-[10px] font-normal">{w.locality}</span>
                      </td>

                      {/* Trust Score */}
                      <td className="p-4">
                        <span className="font-black text-sm text-navy-primary">{w.trustScore}</span>
                        <span className="text-slate-400 text-[10px]"> / 100</span>
                      </td>

                      {/* Tier Badge */}
                      <td className="p-4">
                        <BadgeLevel level={w.badgeLevel} size="sm" />
                      </td>

                      {/* Vouches & Moderation Button */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{w.vouches.length} Verified</span>
                          {w.vouches.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setModeratingWorker(w)}
                              className="text-[10px] font-bold text-navy-primary bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                              title="Moderate individual vouches"
                            >
                              Moderate
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Assessor Verification */}
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

                      {/* Actions Column (Requirement 6: Delete Profile + Moderate) */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => simulateVouch(w.id)}
                            className="px-2 py-1 rounded-lg bg-orange-light text-orange hover:bg-orange hover:text-white border border-orange/20 font-bold text-[10px] transition-colors"
                            title="Simulate instant vouch"
                          >
                            + Vouch
                          </button>

                          <Link
                            href={`/passport/${w.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-primary hover:bg-slate-100"
                            title="Open digital passport"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Red Delete Profile Button (Requirement 6) */}
                          <button
                            type="button"
                            onClick={() => setDeletingWorker(w)}
                            className="p-1.5 rounded-lg text-red-500 hover:text-white hover:bg-red-600 transition-colors border border-red-200 hover:border-red-600"
                            title="Delete profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal (Requirement 6) */}
      {deletingWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-navy-primary">
                Remove Worker Profile?
              </h3>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                Are you sure you want to delete <strong>{deletingWorker.name}</strong> ({deletingWorker.trade}) from the National Skill Register?
                This will remove their SkillPassport, verification records, and job history.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                type="button"
                onClick={() => setDeletingWorker(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeleteWorker}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Delete Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Moderate Vouches Dialog (Requirement 6) */}
      {moderatingWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-orange" />
                <div>
                  <h3 className="text-sm font-black text-navy-primary">
                    Moderate Vouches — {moderatingWorker.name}
                  </h3>
                  <p className="text-[11px] text-content-secondary">
                    Review and remove suspicious or fraudulent endorsements
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModeratingWorker(null)}
                className="p-1 rounded-full text-slate-400 hover:text-navy-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {moderatingWorker.vouches.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No vouches on record for this worker.
                </div>
              ) : (
                moderatingWorker.vouches.map((vouch) => (
                  <div
                    key={vouch.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-navy-primary">{vouch.vouchedByName}</p>
                        <p className="text-[10px] text-slate-400">{vouch.role} • {vouch.vouchedByPhone}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: vouch.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-orange text-orange" />
                        ))}
                      </div>
                    </div>

                    {vouch.comment && (
                      <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-xl border border-slate-100">
                        &quot;{vouch.comment}&quot;
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{vouch.createdAt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVouch(moderatingWorker.id, vouch.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Vouch</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                type="button"
                onClick={() => setModeratingWorker(null)}
                variant="primary"
                size="sm"
              >
                Close Moderation
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
