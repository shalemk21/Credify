'use client';

import React from 'react';
import Link from 'next/link';
import { EmployerShell } from '@/components/employer/EmployerShell';
import { Button } from '@/components/shared/Button';
import { Building2, Shield, Bell, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function EmployerSettingsPage() {
  return (
    <EmployerShell>
      <div className="max-w-2xl space-y-6">
        {/* Top Header with Physical Back Button (Requirement 7) */}
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
              Employer Profile & Preferences
            </h1>
            <p className="text-xs text-content-secondary">
              Manage your organization credentials, notification alerts, and hiring policies
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 text-sm text-navy-primary">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-orange text-white flex items-center justify-center font-black text-xl shadow-button">
              AB
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy-primary">ABC Contractors, Bengaluru</h3>
              <p className="text-xs text-slate-500 font-medium">Licensed Electrical & Civil General Contractor</p>
              <div className="flex items-center gap-1.5 text-xs text-green font-bold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Business GSTIN: 29AABCA1234F1Z8</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block mb-1 text-slate-500">Contact Person</label>
              <input
                type="text"
                defaultValue="Arun Bhat (Project Manager)"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-500">Primary Office Locality</label>
              <input
                type="text"
                defaultValue="Whitefield, Bengaluru"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-500">Phone for SMS Worker Alerts</label>
              <input
                type="text"
                defaultValue="+91 98450 11223"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-500">Default Daily Rate Benchmark (₹)</label>
              <input
                type="number"
                defaultValue="1200"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => alert('Preferences saved!')}
              variant="orange"
              size="md"
              className="font-bold"
            >
              Save Organization Settings
            </Button>
          </div>
        </div>
      </div>
    </EmployerShell>
  );
}
