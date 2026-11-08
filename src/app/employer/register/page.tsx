'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';
import { db } from '@/lib/db';
import { saveStoredUser } from '@/lib/auth';
import { EmployerProfile, BengaluruLocality } from '@/types';

export default function EmployerRegisterPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [type, setType] = useState('contractor');
  const [locality, setLocality] = useState<BengaluruLocality>('Whitefield');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [expectedWorkers, setExpectedWorkers] = useState('5-10');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<EmployerProfile | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newEmp: EmployerProfile = {
      id: 'emp-' + Date.now(),
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      type,
      locality,
      phone: phone.trim(),
      email: email.trim(),
      gstin: gstin.trim().toUpperCase(),
      verified: false,
      status: 'PENDING_APPROVAL',
      applicationDate: new Date().toISOString().slice(0, 10),
      shortlistedWorkerIds: [],
    };

    setTimeout(() => {
      db.addEmployer(newEmp);

      // Save user session so they enter as this employer
      saveStoredUser({
        id: newEmp.id,
        role: 'employer',
        name: newEmp.contactPerson || newEmp.companyName,
        email: newEmp.email || `${newEmp.id}@credify.in`,
        phone: newEmp.phone,
        organization: newEmp.companyName,
        designation: 'Applicant / Project Lead',
        avatar: newEmp.companyName.slice(0, 2).toUpperCase(),
        loginTime: new Date().toISOString(),
      });

      setSubmittedApplication(newEmp);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between selection:bg-orange/20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" href="/" />
          <div className="flex items-center gap-3">
            <Link
              href="/login?role=employer"
              className="text-xs md:text-sm font-bold text-navy-primary hover:text-orange transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 md:py-12">
        {submittedApplication ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                Application Submitted • Under Admin Review
              </span>
              <h2 className="text-2xl font-black text-navy-primary">
                Employer Registration Received!
              </h2>
              <p className="text-sm text-content-secondary max-w-md mx-auto">
                Your application for <strong>{submittedApplication.companyName}</strong> has been logged to the Credify database.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Application Reference ID:</span>
                <span className="font-mono font-bold text-navy-primary">{submittedApplication.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">GSTIN / Reg No:</span>
                <span className="font-mono font-bold text-navy-primary">{submittedApplication.gstin || 'Not Provided'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Contact Person:</span>
                <span className="font-bold text-navy-primary">{submittedApplication.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Approval Workflow:</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Queued for Directorate Admin Approval
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                href="/employer"
                variant="orange"
                fullWidth
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Go to Employer Dashboard
              </Button>
              <Button
                href="/admin"
                variant="outline"
                fullWidth
                size="lg"
              >
                Open Admin Portal to Approve
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-card space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-light border border-orange/20 text-orange font-bold text-xs mb-2">
                <Building2 className="w-4 h-4" />
                <span>Enterprise Onboarding</span>
              </div>
              <h2 className="text-2xl font-black text-navy-primary tracking-tight">
                Register Employer Organization
              </h2>
              <p className="text-xs md:text-sm text-content-secondary mt-1">
                Apply to access verified blue-collar talent in Bengaluru. All employer accounts are validated by Credify Directorate before active hiring.
              </p>
            </div>

            {/* Mandatory Approval Alert */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Credify Trust Standard & Admin Verification Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                To safeguard worker welfare and wage transparency, new employer applications are reviewed and approved by a Credify Administrator before direct dispatch permissions are granted.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-navy-primary mb-1">Company / Organization Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Sobha Urban Infrastructure Pvt Ltd"
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-bold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-navy-primary mb-1">Contact Person & Title *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g., Rajesh Nair (VP Projects)"
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-bold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-navy-primary mb-1">Business Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-bold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  >
                    <option value="contractor">General Contractor</option>
                    <option value="builder">Property Developer / Builder</option>
                    <option value="subcontractor">Subcontractor (MEP / Civil)</option>
                    <option value="interior">Interior Fitout Firm</option>
                    <option value="individual">Homeowner / Independent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-navy-primary mb-1">Primary Bengaluru Locality *</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value as BengaluruLocality)}
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-bold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  >
                    <option value="Whitefield">Whitefield</option>
                    <option value="Koramangala">Koramangala</option>
                    <option value="HSR Layout">HSR Layout</option>
                    <option value="Indiranagar">Indiranagar</option>
                    <option value="Jayanagar">Jayanagar</option>
                    <option value="Electronic City">Electronic City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-navy-primary mb-1">Business GSTIN (Karnataka: 29...) *</label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="e.g., 29AAECS5678B1Z2"
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-mono font-bold text-navy-primary uppercase focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-navy-primary mb-1">Official Mobile / Phone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +91 99450 55443"
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-bold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-navy-primary mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., hiring@sobhainfra.in"
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-canvas/40 text-sm font-bold text-navy-primary focus:outline-none focus:ring-2 focus:ring-navy-primary/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="orange"
                  fullWidth
                  size="lg"
                  loading={isSubmitting}
                  className="font-extrabold text-sm md:text-base"
                >
                  Submit Employer Application for Admin Approval
                </Button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                Already registered? <Link href="/login?role=employer" className="text-orange underline font-bold">Sign In directly</Link>
              </p>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-dark text-white/80 py-5 text-xs text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo variant="dark" size="sm" showProduct={false} />
          <div className="flex items-center gap-4 text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/login" className="hover:text-white">Portal Sign In</Link>
            <Link href="/admin" className="hover:text-orange">Admin Approval Queue</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

