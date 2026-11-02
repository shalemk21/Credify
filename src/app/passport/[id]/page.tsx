'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { TrustRing } from '@/components/shared/TrustRing';
import { Chip } from '@/components/shared/Chip';
import { QRCard } from '@/components/shared/QRCard';
import { EvidenceGallery } from '@/components/shared/EvidenceGallery';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { INITIAL_WORKERS, db } from '@/lib/db';
import { generateSkillPassportPDF } from '@/lib/pdf';
import {
  Share2,
  Download,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Star,
  ExternalLink,
  Lock,
  ArrowLeft
} from 'lucide-react';

export default function PublicPassportPage() {
  const params = useParams();
  const router = useRouter();
  const workerId = params?.id as string;
  
  // Lookup worker from database or fallback
  const worker = db.getWorkerById(workerId) || INITIAL_WORKERS.find((w) => w.id === workerId) || INITIAL_WORKERS[0];

  const [shareSuccess, setShareSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? window.location.href
    : `http://localhost:3000/passport/${worker.id}`;

  const audioText = `Verified SkillPassport for ${worker.name}. Trust score ${worker.trustScore} with ${worker.yearsOfExperience} years experience, ${worker.vouches.length} verified client vouches.`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${worker.name}'s Verified SkillPassport`,
          text: `Check out ${worker.name}'s verified credential on Credify (Trust Score: ${worker.trustScore}/100)`,
          url: publicUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(publicUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await generateSkillPassportPDF(worker, publicUrl);
    } catch (err) {
      console.error('Error generating SkillPassport PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Header with Physical Back Button (Requirement 7) */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-12 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push('/employer');
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-navy-primary transition-colors border border-slate-200"
            title="Go back"
            aria-label="Back to previous page"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <Logo size="md" href="/" />
        </div>

        <div className="flex items-center gap-3">
          <SpeakerButton textToRead={audioText} size="md" />
          <Button href="/employer" variant="outline" size="sm" className="hidden sm:inline-flex">
            For Employers
          </Button>
          <Button href="/worker/onboarding" variant="orange" size="sm">
            Create Your Passport
          </Button>
        </div>
      </header>

      {/* Main Container: Mobile = Single Column, Desktop = Two-Column */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Verification banner */}
        <div className="mb-6 bg-green-tint border border-green/30 p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-green-dark">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green" />
            <span>Cryptographically Verified Public Credential • Publicly Accessible (No Login Required)</span>
          </div>
          <span className="hidden sm:inline text-[11px] text-green-dark/70 font-semibold">
            DPDP Act 2023 Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Desktop 5 cols): Profile Card + QR Code */}
          <div className="lg:col-span-5 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card">
            
            {/* Header with Navy & Orange Swoosh */}
            <div className="bg-navy-primary p-6 pb-16 text-white relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange/90 rounded-full blur-xs" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-200">
                  National Skill Register
                </span>
                <BadgeLevel level={worker.badgeLevel} size="sm" />
              </div>
            </div>

            {/* Profile Body */}
            <div className="px-6 pb-6 pt-0 relative">
              <div className="-mt-12 flex justify-between items-end mb-3">
                <img
                  src={worker.avatarUrl}
                  alt={worker.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-slate-100"
                />
                <TrustRing score={worker.trustScore} size={70} strokeWidth={5} label="Trust Score" />
              </div>

              <h1 className="text-2xl font-black text-navy-primary tracking-tight">
                {worker.name}
              </h1>
              <p className="text-xs text-content-secondary font-medium mt-0.5">
                {worker.trade === 'ELECTRICIAN' ? 'Certified Electrician' : 'Certified Plumber'} • {worker.locality}, Bengaluru
              </p>

              <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-slate-100 text-center">
                <div>
                  <span className="text-lg font-black text-navy-primary block">
                    {worker.yearsOfExperience} Years
                  </span>
                  <span className="text-xs text-content-secondary font-semibold">
                    Experience
                  </span>
                </div>
                <div>
                  <span className="text-lg font-black text-navy-primary block">
                    {worker.vouches.length} Vouches
                  </span>
                  <span className="text-xs text-content-secondary font-semibold">
                    Client Endorsements
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2 mb-5">
                <span className="text-xs font-bold text-navy-primary block">
                  Verified Competencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {worker.verifiedSkills.map((skill) => (
                    <Chip key={skill} label={skill} variant="green" size="sm" />
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                <QRCard url={publicUrl} size={84} />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-navy-primary">Instant Verification QR</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Scan with any smartphone camera to view live vouch records and trust metrics.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <Button
                  onClick={handleShare}
                  variant="primary"
                  size="md"
                  icon={<Share2 className="w-4 h-4" />}
                >
                  {shareSuccess ? 'Copied Link' : 'Share'}
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="orange"
                  size="md"
                  loading={downloading}
                  icon={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
              </div>

            </div>
          </div>

          {/* Right Column (Desktop 7 cols): Evidence Gallery & Verified Vouches */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Work Evidence Showcase */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-extrabold text-navy-primary">
                  Work Evidence Showcase
                </h2>
                <span className="text-xs text-slate-400 font-semibold">
                  Timestamped & GPS Verified
                </span>
              </div>
              <EvidenceGallery items={worker.evidence} showPreview={true} />
            </div>

            {/* Client Vouches & Endorsements */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-extrabold text-navy-primary">
                  Verified Client Vouches ({worker.vouches.length})
                </h2>
                <Link
                  href={`/vouch/token-${worker.id}`}
                  className="text-xs font-bold text-orange hover:underline"
                >
                  + Add Vouch
                </Link>
              </div>

              <div className="space-y-3">
                {worker.vouches.map((vouch) => (
                  <div
                    key={vouch.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-navy-primary">
                          {vouch.vouchedByName}
                        </span>
                        <span className="text-[10px] font-bold bg-navy-primary/10 text-navy-primary px-2 py-0.5 rounded-full">
                          {vouch.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: vouch.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-orange text-orange" />
                        ))}
                      </div>
                    </div>
                    {vouch.comment && (
                      <p className="text-xs text-content-primary leading-relaxed italic">
                        &quot;{vouch.comment}&quot;
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-green font-bold">
                        <CheckCircle2 className="w-3 h-3 text-green" />
                        Phone Verified OTP
                      </span>
                      <span>{vouch.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
