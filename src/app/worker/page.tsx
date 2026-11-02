'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { Logo } from '@/components/shared/Logo';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { TrustRing } from '@/components/shared/TrustRing';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { INITIAL_WORKERS } from '@/lib/db';
import {
  Award,
  FileCheck,
  TrendingUp,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  QrCode
} from 'lucide-react';

export default function WorkerHomePage() {
  const { t, locale } = useI18n();
  const worker = INITIAL_WORKERS[0]; // Ramesh K.

  const [availability, setAvailability] = useState<'today' | 'this_week' | 'not_looking'>('today');

  const audioWelcome = locale === 'hi'
    ? `नमस्ते ${worker.name}। आपका भरोसा स्कोर ${worker.trustScore} है। आपकी उपलब्धता: आज काम के लिए उपलब्ध।`
    : locale === 'kn'
    ? `ನಮಸ್ಕಾರ ${worker.name}. ನಿಮ್ಮ ವಿಶ್ವಾಸ ಅಂಕ ${worker.trustScore}. ಇಂದು ಕೆಲಸಕ್ಕೆ ಲಭ್ಯವಿದ್ದೀರಿ.`
    : `Welcome ${worker.name}. Your trust score is ${worker.trustScore}. Your current status: Available today.`;

  return (
    <PhoneFrame showBottomNav={true}>
      <div className="p-4 space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Logo size="sm" showProduct={true} href="/" />
          <div className="flex items-center gap-2">
            <SpeakerButton textToRead={audioWelcome} size="sm" />
            <Link
              href="/worker/privacy"
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              title="Privacy settings"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Worker Hero Profile Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={worker.avatarUrl}
                  alt={worker.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 ring-2 ring-slate-100"
                />
                {worker.safetyAware && (
                  <span className="absolute -bottom-1 -right-1 bg-green text-white p-0.5 rounded-full ring-2 ring-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-navy-primary">
                    {worker.name}
                  </h2>
                  <BadgeLevel level={worker.badgeLevel} size="sm" />
                </div>
                <p className="text-xs text-content-secondary mt-0.5 font-medium">
                  {worker.trade === 'ELECTRICIAN' ? 'Electrician' : 'Plumber'} • {worker.locality}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-green-dark font-bold mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green" />
                  <span>Verified Profile ({worker.vouches.length} Vouches)</span>
                </div>
              </div>
            </div>

            <TrustRing score={worker.trustScore} size={64} strokeWidth={5} />
          </div>

          {/* Availability Toggle (Section 6 #10 and Section 10 #5) */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-navy-primary mb-1.5">
              Your Current Availability:
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl text-[11px] font-bold text-center">
              <button
                type="button"
                onClick={() => setAvailability('today')}
                className={`py-2 px-1 rounded-xl transition-all ${
                  availability === 'today'
                    ? 'bg-green text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-primary'
                }`}
              >
                Available Today
              </button>
              <button
                type="button"
                onClick={() => setAvailability('this_week')}
                className={`py-2 px-1 rounded-xl transition-all ${
                  availability === 'this_week'
                    ? 'bg-navy-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-primary'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setAvailability('not_looking')}
                className={`py-2 px-1 rounded-xl transition-all ${
                  availability === 'not_looking'
                    ? 'bg-slate-300 text-slate-800 shadow-xs'
                    : 'text-slate-600 hover:text-navy-primary'
                }`}
              >
                Busy
              </button>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Tiles */}
        <div className="grid grid-cols-2 gap-3">
          
          <Link
            href="/worker/passport"
            className="bg-navy-primary text-white p-4 rounded-3xl flex flex-col justify-between shadow-button-navy group hover:bg-navy-light transition-all"
          >
            <div className="flex items-center justify-between">
              <Award className="w-6 h-6 text-orange" />
              <QrCode className="w-4 h-4 text-slate-300" />
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-black text-white">Skill Passport</h3>
              <p className="text-[10px] text-blue-200 mt-0.5">Show QR & Download PDF</p>
            </div>
          </Link>

          <Link
            href="/worker/evidence"
            className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <FileCheck className="w-6 h-6 text-green" />
              <span className="text-[10px] font-black text-green-dark bg-green-tint px-2 py-0.5 rounded-full">
                {worker.evidence.length} Items
              </span>
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-black text-navy-primary">Work Evidence</h3>
              <p className="text-[10px] text-content-secondary mt-0.5">Upload photos & videos</p>
            </div>
          </Link>

          <Link
            href="/worker/jobs"
            className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <Briefcase className="w-6 h-6 text-orange" />
              <span className="w-2 h-2 rounded-full bg-orange animate-ping" />
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-black text-navy-primary">Jobs for you</h3>
              <p className="text-[10px] text-content-secondary mt-0.5">Direct contractor inquiries</p>
            </div>
          </Link>

          <Link
            href="/worker/growth"
            className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <TrendingUp className="w-6 h-6 text-navy-primary" />
              <span className="text-[10px] font-bold text-orange">+25% Uplift</span>
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-black text-navy-primary">Growth Plan</h3>
              <p className="text-[10px] text-content-secondary mt-0.5">Schemes & Next skills</p>
            </div>
          </Link>

        </div>

        {/* Start Fresh Onboarding Live Flow Demo CTA */}
        <div className="bg-orange-light border border-orange/30 p-4 rounded-3xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-navy-primary">Test Live Onboarding Walkthrough</h4>
            <p className="text-[10px] text-content-secondary">Voice skill capture, photo upload & skill check</p>
          </div>
          <Link
            href="/worker/onboarding"
            className="bg-orange text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-button shrink-0"
          >
            Start →
          </Link>
        </div>

      </div>
    </PhoneFrame>
  );
}
