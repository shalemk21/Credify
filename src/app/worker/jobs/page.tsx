'use client';

import React, { useState } from 'react';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { INITIAL_JOB_REQUESTS } from '@/lib/db';
import { JobRequest } from '@/types';
import { Briefcase, MapPin, IndianRupee, Clock, CheckCircle2, XCircle, Building2 } from 'lucide-react';

export default function WorkerJobsPage() {
  const { locale } = useI18n();
  const [jobs, setJobs] = useState<JobRequest[]>(INITIAL_JOB_REQUESTS);
  const [workerStatus, setWorkerStatus] = useState<Record<string, 'accepted' | 'declined' | 'pending'>>({
    'job-1': 'pending',
    'job-2': 'accepted',
  });

  const audioText = locale === 'hi'
    ? 'आपके लिए काम। नियोक्ताओं द्वारा भेजे गए अवसर देखें और स्वीकार करें।'
    : locale === 'kn'
    ? 'ನಿಮಗಾಗಿ ಕೆಲಸಗಳು. ಉದ್ಯೋಗದಾತರು ಕಳುಹಿಸಿದ ಅವಕಾಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಒಪ್ಪಿಕೊಳ್ಳಿ.'
    : 'Jobs for you. Review job requests sent by verified employers in your locality and accept.';

  const handleRespond = (jobId: string, status: 'accepted' | 'declined') => {
    setWorkerStatus((prev) => ({ ...prev, [jobId]: status }));
  };

  return (
    <PhoneFrame showBottomNav={true}>
      <div className="p-4 space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-light text-orange flex items-center justify-center">
              <Briefcase className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-navy-primary tracking-tight">
                Jobs for You
              </h1>
              <p className="text-[11px] text-content-secondary">
                Verified site openings matching your SkillPassport
              </p>
            </div>
          </div>
          <SpeakerButton textToRead={audioText} size="md" />
        </div>

        {/* Job Inquiries List */}
        <div className="space-y-3.5">
          {jobs.map((job) => {
            const currentResp = workerStatus[job.id] || 'pending';

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-3.5"
              >
                {/* Employer & Locality Header */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-orange uppercase tracking-wider block">
                      Direct Employer Request
                    </span>
                    <h3 className="text-sm font-extrabold text-navy-primary">
                      {job.employerName}
                    </h3>
                    <p className="text-xs text-content-secondary flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-orange" />
                      {job.locality}, Bengaluru
                    </p>
                  </div>

                  <span className="text-xs font-bold bg-navy-primary/10 text-navy-primary px-2.5 py-1 rounded-full">
                    {job.trade}
                  </span>
                </div>

                {/* Job Description */}
                <p className="text-xs text-content-primary leading-relaxed font-medium">
                  {job.description}
                </p>

                {/* Wage & Duration Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Wage Offer</span>
                    <span className="font-extrabold text-green-dark text-sm">
                      ₹{job.dailyWageOffer} / day
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Duration</span>
                    <span className="font-bold text-navy-primary text-xs">
                      {job.duration}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Accept / Not Available */}
                <div>
                  {currentResp === 'accepted' ? (
                    <div className="p-3 bg-green-tint border border-green/30 rounded-2xl flex items-center justify-between text-xs font-bold text-green-dark">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green" />
                        You Accepted This Job
                      </span>
                      <span className="text-[10px] font-medium text-green-dark/70">
                        Employer notified
                      </span>
                    </div>
                  ) : currentResp === 'declined' ? (
                    <div className="p-3 bg-slate-100 rounded-2xl text-xs font-bold text-slate-500 text-center">
                      Marked as Not Available
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleRespond(job.id, 'declined')}
                        className="py-2.5 px-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        Not Available
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRespond(job.id, 'accepted')}
                        className="py-2.5 px-3 rounded-2xl text-xs font-black text-white bg-green hover:bg-green-dark shadow-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </PhoneFrame>
  );
}
