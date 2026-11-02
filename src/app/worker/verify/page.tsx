'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { ProgressDots } from '@/components/shared/ProgressDots';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { ShieldCheck, Check, Sparkles, Smartphone } from 'lucide-react';

export default function WorkerVerifyPage() {
  const router = useRouter();
  const { t, locale } = useI18n();

  const [phone, setPhone] = useState('98765 43210');
  const [name, setName] = useState('Ramesh Kumar');
  const [trade, setTrade] = useState<'ELECTRICIAN' | 'PLUMBER'>('ELECTRICIAN');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const audioText = locale === 'hi'
    ? 'अपना मोबाइल नंबर दर्ज करें और ओटीपी सत्यापित करें। डेमो ओटीपी १२३४ है।'
    : locale === 'kn'
    ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ. ಡೆಮೊ ಒಟಿಪಿ ೧೨೩೪.'
    : 'Enter your phone number and verify with OTP. Demo OTP is 1234.';

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('1234'); // Pre-fill demo OTP
  };

  const handleVerify = () => {
    if (otp !== '1234') {
      setOtpError('Invalid OTP. Use Demo OTP: 1234');
      return;
    }
    // Save state in localStorage for the active session
    if (typeof window !== 'undefined') {
      localStorage.setItem('credify_worker_phone', phone);
      localStorage.setItem('credify_worker_name', name);
      localStorage.setItem('credify_worker_trade', trade);
    }
    router.push('/worker/skills');
  };

  return (
    <PhoneFrame showBottomNav={false} backHref="/worker/onboarding">
      <div className="p-5 flex flex-col justify-between min-h-full space-y-6">
        
        {/* Top Header & Speaker */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-navy-primary tracking-tight">
              {t.screen2.title}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              {t.screen2.subtitle}
            </p>
          </div>
          <SpeakerButton textToRead={audioText} size="md" />
        </div>

        {/* 3-Step Progress Dots (Step 1 active) */}
        <ProgressDots currentStep={1} totalSteps={3} />

        {/* Center Illustration: Smartphone with Green Shield & Leaves (Matches Phone 2 in Showcase) */}
        <div className="flex justify-center my-2">
          <div className="w-48 h-44 relative flex items-center justify-center">
            <svg viewBox="0 0 200 180" fill="none" className="w-44 h-40 drop-shadow-sm">
              {/* Decorative Leaves/Plants */}
              <path d="M40 140 C30 110 50 80 60 70 C70 95 65 125 40 140 Z" fill="#2E9E5B" opacity="0.3" />
              <path d="M160 140 C170 110 150 80 140 70 C130 95 135 125 160 140 Z" fill="#2E9E5B" opacity="0.3" />
              <path d="M50 150 C35 135 45 110 55 105 C60 125 55 140 50 150 Z" fill="#2E9E5B" opacity="0.4" />
              <path d="M150 150 C165 135 155 110 145 105 C140 125 145 140 150 150 Z" fill="#2E9E5B" opacity="0.4" />

              {/* Smartphone Frame */}
              <rect x="68" y="15" width="64" height="135" rx="14" fill="#0B2A5B" />
              <rect x="72" y="22" width="56" height="120" rx="10" fill="#FFFFFF" />
              <circle cx="100" cy="18" r="2" fill="#64748B" />

              {/* Green Shield with Checkmark */}
              <path
                d="M100 50 L118 60 V85 C118 100 110 110 100 115 C90 110 82 100 82 85 V60 L100 50 Z"
                fill="#E8F6EE"
                stroke="#2E9E5B"
                strokeWidth="3.5"
              />
              <path
                d="M93 82 L98 87 L108 76"
                stroke="#2E9E5B"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Input Fields Card */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
          
          {/* Phone Number Input */}
          <div>
            <label className="block text-xs font-bold text-navy-primary mb-1.5">
              {t.screen2.phoneLabel}
            </label>
            <div className="flex items-center rounded-2xl border-2 border-slate-200 px-3.5 py-3 focus-within:border-navy-primary bg-slate-50/50 transition-colors">
              <span className="text-sm font-black text-navy-primary mr-2">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.screen2.phonePlaceholder}
                className="w-full text-base font-extrabold text-navy-primary bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Trade Selection for Demo */}
          <div>
            <label className="block text-xs font-bold text-navy-primary mb-1.5">
              Your Primary Trade
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrade('ELECTRICIAN')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border-2 transition-all ${
                  trade === 'ELECTRICIAN'
                    ? 'border-navy-primary bg-navy-primary text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                ⚡ Electrician
              </button>
              <button
                type="button"
                onClick={() => setTrade('PLUMBER')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border-2 transition-all ${
                  trade === 'PLUMBER'
                    ? 'border-navy-primary bg-navy-primary text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                🔧 Plumber
              </button>
            </div>
          </div>

          {/* Optional Name Input */}
          <div>
            <label className="block text-xs font-bold text-navy-primary mb-1.5">
              {t.screen2.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.screen2.namePlaceholder}
              className="w-full text-sm font-bold text-navy-primary rounded-2xl border-2 border-slate-200 px-3.5 py-3 focus:outline-none focus:border-navy-primary bg-slate-50/50"
            />
          </div>

          {/* OTP Section */}
          {!otpSent ? (
            <Button
              type="button"
              onClick={handleSendOtp}
              variant="primary"
              fullWidth
              size="lg"
              className="mt-2 font-bold"
            >
              {t.screen2.sendOtp}
            </Button>
          ) : (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy-primary mb-1.5">
                  {t.screen2.enterOtp}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[12px] text-2xl font-black text-navy-primary rounded-2xl border-2 border-orange px-3.5 py-2.5 bg-orange-light/30 focus:outline-none"
                />
                {otpError && (
                  <p className="text-xs text-red-500 font-bold mt-1 text-center">{otpError}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                variant="orange"
                fullWidth
                size="lg"
                className="font-bold"
              >
                {t.screen2.verifyAndContinue}
              </Button>
            </div>
          )}

          {/* Demo OTP Helper Card (Matches Phone 2 in Showcase) */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2.5 text-center">
            <span className="text-xs font-black text-navy-primary">
              {t.screen2.demoOtpHelper}
            </span>
          </div>

        </div>

      </div>
    </PhoneFrame>
  );
}
