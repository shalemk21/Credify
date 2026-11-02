'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { Button } from '@/components/shared/Button';
import { INITIAL_JOB_REQUESTS, INITIAL_WORKERS } from '@/lib/db';
import { JobRequest, Trade, BengaluruLocality } from '@/types';
import { Plus, CheckCircle2, Clock, Send, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';

export default function HireRequestsPage() {
  const [jobs, setJobs] = useState<JobRequest[]>(INITIAL_JOB_REQUESTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [trade, setTrade] = useState<Trade>('ELECTRICIAN');
  const [locality, setLocality] = useState<BengaluruLocality>('Whitefield');
  const [requiredWorkers, setRequiredWorkers] = useState('2');
  const [duration, setDuration] = useState('3 Days');
  const [dailyWage, setDailyWage] = useState('1200');
  const [description, setDescription] = useState('');

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
      responses: [
        { workerId: 'worker-ramesh-k', status: 'pending' },
      ],
    };

    setJobs([newJob, ...jobs]);
    setShowCreateModal(false);
  };

  return (
    <EmployerShell>
      <div className="space-y-6">
        {/* Top Header with Physical Back Button (Requirement 7) */}
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
                Directly broadcast opportunities to verified local talent in Bengaluru
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

        {/* Jobs list */}
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
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
                    <h3 className="text-base font-extrabold text-navy-primary">
                      {job.requiredWorkers}x {job.trade === 'ELECTRICIAN' ? 'Electricians' : 'Plumbers'} Needed
                    </h3>
                    <p className="text-xs text-slate-400">
                      Posted by {job.employerName} • {job.createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      job.status === 'open'
                        ? 'bg-green-tint text-green-dark border border-green/30'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {job.status === 'open' ? 'Active Broadcast' : 'Fulfilled'}
                  </span>
                </div>
              </div>

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
                  <span className="text-slate-400 block font-medium">Dispatched To</span>
                  <span className="font-bold text-navy-primary block mt-0.5">
                    {job.responses.length} Candidates
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
                  <span className="font-bold text-navy-primary">Ramesh K.</span>
                  <span className="text-[10px] font-bold bg-orange-light text-orange px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Offer Dispatched
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
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-navy-primary">
                Post Site Job Broadcast
              </h3>
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
                    Broadcast Request
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
