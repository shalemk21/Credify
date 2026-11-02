'use client';

import React, { useState } from 'react';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { Button } from '@/components/shared/Button';
import { INITIAL_JOB_REQUESTS, INITIAL_WORKERS } from '@/lib/db';
import { JobRequest, Trade, BengaluruLocality } from '@/types';
import { Plus, CheckCircle2, Clock, Send, MapPin, AlertCircle } from 'lucide-react';

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-navy-primary tracking-tight">
              Hire Requests & Site Job Openings
            </h1>
            <p className="text-xs text-content-secondary">
              Directly broadcast opportunities to verified local talent in Bengaluru
            </p>
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

        {/* Job Requests List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy-primary/10 text-navy-primary">
                    {job.trade}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange" />
                    {job.locality}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-bold text-navy-primary">{job.duration}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Daily Wage:</span>
                  <span className="font-extrabold text-green-dark">₹{job.dailyWageOffer}/day</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-content-primary leading-relaxed font-medium">
                  {job.description}
                </p>
              </div>

              {/* Worker Responses Section */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-navy-primary mb-2 flex items-center justify-between">
                  <span>Candidate Responses ({job.responses.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Updated live from Worker PWA</span>
                </h4>

                <div className="space-y-2">
                  {job.responses.map((resp, i) => {
                    const worker = INITIAL_WORKERS.find((w) => w.id === resp.workerId);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-2.5">
                          {worker && (
                            <img
                              src={worker.avatarUrl}
                              alt={worker.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <span className="font-bold text-navy-primary">{worker?.name || 'Worker'}</span>
                            <span className="text-slate-400 text-[11px] ml-1.5 font-medium">
                              ({worker?.badgeLevel} {worker?.trade})
                            </span>
                          </div>
                        </div>

                        <div>
                          {resp.status === 'accepted' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-tint text-green-dark">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                              Accepted Job
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              Awaiting Worker Response
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Post New Job Request */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-navy-primary">
                Broadcast Job Request
              </h3>
              <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs font-semibold text-navy-primary">
                <div>
                  <label className="block mb-1 text-slate-500">Trade Required</label>
                  <select
                    value={trade}
                    onChange={(e) => setTrade(e.target.value as Trade)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    <option value="ELECTRICIAN">Electrician</option>
                    <option value="PLUMBER">Plumber</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Locality in Bengaluru</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value as BengaluruLocality)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
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
                    <label className="block mb-1 text-slate-500">Workers Needed</label>
                    <input
                      type="number"
                      value={requiredWorkers}
                      onChange={(e) => setRequiredWorkers(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Daily Wage (₹)</label>
                  <input
                    type="number"
                    value={dailyWage}
                    onChange={(e) => setDailyWage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-500">Job Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific work (e.g. conduit wiring, bathroom fittings)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
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
                    Post Request
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
