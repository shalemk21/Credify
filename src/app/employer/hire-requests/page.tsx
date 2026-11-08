'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { Button } from '@/components/shared/Button';
import { db } from '@/lib/db';
import { JobRequest, Trade, BengaluruLocality } from '@/types';
import { Plus, CheckCircle2, Clock, Send, MapPin, AlertCircle, ArrowLeft, ShieldCheck, XCircle } from 'lucide-react';

export default function HireRequestsPage() {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [trade, setTrade] = useState<Trade>('ELECTRICIAN');
  const [locality, setLocality] = useState<BengaluruLocality>('Whitefield');
  const [requiredWorkers, setRequiredWorkers] = useState('2');
  const [duration, setDuration] = useState('3 Days');
  const [dailyWage, setDailyWage] = useState('1200');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setJobs(db.getJobs());
  }, []);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobRequest = {
      id: 'job-' + Date.now(),
      employerId: 'emp-abc',
      employerName: 'ABC Contractors, Bengaluru',
      trade,
      locality,
      requiredWorkers: parseInt(requiredWorkers, 10),
      duration,
      dailyWageOffer: parseInt(dailyWage, 10),
      description: description || `Urgent ${trade.toLowerCase()} required for upcoming installation project.`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'open',
      approvalStatus: 'PENDING_ADMIN_APPROVAL', // Requires admin approval!
      responses: [
        { workerId: 'worker-ramesh-k', status: 'pending' },
      ],
    };

    const saved = db.addJob(newJob);
    setJobs([saved, ...jobs]);
    setShowCreateModal(false);
  };

  return (
    <EmployerShell>
      <div className="space-y-6">
        {/* Top Header with Physical Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/employer"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-navy-primary shadow-xs transition-colors shrink-0"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-navy-primary tracking-tight">
                Hire Requests & Site Job Openings
              </h1>
              <p className="text-xs text-content-secondary">
                Track hire applications and broadcasts submitted to verified talent in Bengaluru
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="orange"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Post Job Request
          </Button>
        </div>

        {/* Informative Banner regarding Admin Approval */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-navy-primary">
                Directorate Approval Workflow Active
              </p>
              <p className="text-content-secondary text-[11px]">
                To maintain fair wage standards, all employer job applications are verified by Admin before candidate dispatch.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="text-xs font-bold text-orange hover:underline shrink-0 hidden sm:inline"
          >
            View Admin Approvals Queue →
          </Link>
        </div>

        {/* Jobs list */}
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => {
            const isApproved = job.approvalStatus === 'APPROVED';
            const isPending = !job.approvalStatus || job.approvalStatus === 'PENDING_ADMIN_APPROVAL';
            const isRejected = job.approvalStatus === 'REJECTED';

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">
                      {job.trade === 'ELECTRICIAN' ? '⚡' : '🔧'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-navy-primary">
                          {job.requiredWorkers}x {job.trade === 'ELECTRICIAN' ? 'Electricians' : 'Plumbers'} Needed
                        </h3>
                        {job.targetWorkerName && (
                          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            Direct Hire: {job.targetWorkerName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Posted by {job.employerName} • {job.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Admin Approval Status Pill */}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-green-tint text-green-dark border border-green/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                        <span>Admin Approved</span>
                      </span>
                    )}

                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pending Admin Approval</span>
                      </span>
                    )}

                    {isRejected && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        <span>Rejected by Admin</span>
                      </span>
                    )}

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        job.status === 'open'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {job.status === 'open' ? 'Broadcast Open' : 'Fulfilled'}
                    </span>
                  </div>
                </div>

                {/* Rejection notice if any */}
                {isRejected && job.rejectionReason && (
                  <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200 text-xs text-red-700">
                    <span className="font-bold">Directorate Feedback: </span>
                    <span>{job.rejectionReason}</span>
                  </div>
                )}

                {/* Pending admin message */}
                {isPending && (
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>This application is queued for Admin approval before candidate dispatch.</span>
                    </div>
                    <Link
                      href="/admin"
                      className="text-xs font-bold text-amber-800 underline hover:text-amber-900 shrink-0"
                    >
                      Admin Panel →
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-2xl">
                  <div>
                    <span className="text-slate-400 block font-medium">Site Locality</span>
                    <span className="font-bold text-navy-primary flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-orange" />
                      {job.locality}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Contract Duration</span>
                    <span className="font-bold text-navy-primary block mt-0.5">
                      {job.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Daily Wage Offer</span>
                    <span className="font-bold text-navy-primary block mt-0.5">
                      ₹{job.dailyWageOffer} / day
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Admin Audit Status</span>
                    <span className="font-bold text-navy-primary block mt-0.5">
                      {isApproved ? `Approved by ${job.approvedBy || 'Admin'}` : isRejected ? 'Declined' : 'Under Review'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-content-primary leading-relaxed font-medium">
                  {job.description}
                </p>

                {/* Worker response status chip */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">Matched Worker:</span>
                    <span className="font-bold text-navy-primary">{job.targetWorkerName || 'Ramesh K.'}</span>
                    <span className="text-[10px] font-bold bg-orange-light text-orange px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isApproved ? 'Offer Dispatched' : 'Awaiting Admin Approval'}
                    </span>
                  </div>

                  <Link
                    href="/worker/jobs"
                    className="text-xs font-bold text-orange hover:underline flex items-center gap-1"
                  >
                    <span>View Worker View →</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-lg font-black text-navy-primary">
                  Post Site Job Broadcast
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Application will be submitted to Admin Directorate for compliance approval
                </p>
              </div>

              {/* Approval notice */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Approval Required:</strong> After submitting, your job opening will be reviewed by a Credify Administrator prior to dispatch.
                </span>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block mb-1 text-slate-500">Trade Required</label>
                  <select
                    value={trade}
                    onChange={(e) => setTrade(e.target.value as Trade)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="ELECTRICIAN">Electrician</option>
                    <option value="PLUMBER">Plumber</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Bengaluru Locality</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value as BengaluruLocality)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="Whitefield">Whitefield</option>
                    <option value="Koramangala">Koramangala</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="Jayanagar">Jayanagar</option>
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Electronic City">Electronic City</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block mb-1 text-slate-500">Number of Workers</label>
                    <input
                      type="number"
                      min="1"
                      value={requiredWorkers}
                      onChange={(e) => setRequiredWorkers(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500">Daily Wage (₹)</label>
                    <input
                      type="number"
                      value={dailyWage}
                      onChange={(e) => setDailyWage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Days or 1 Month"
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Description / Scope of Work</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the site requirements..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="orange"
                    className="flex-1 font-bold"
                  >
                    Submit for Approval
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </EmployerShell>
  );
}
