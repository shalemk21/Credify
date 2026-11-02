'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { Logo } from '@/components/shared/Logo';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { useI18n, Language } from '@/lib/i18n';

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();

  const languages: { code: Language; label: string; subLabel: string }[] = [
    { code: 'en', label: 'English', subLabel: 'English' },
    { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi' },
    { code: 'kn', label: 'ಕನ್ನಡ', subLabel: 'Kannada' },
  ];

  const handleSelectLanguage = (lang: Language) => {
    setLocale(lang);
  };

  const audioIntro = locale === 'hi'
    ? 'SkillPassport में आपका स्वागत है। अपनी पसंदीदा भाषा चुनें और जारी रखें।'
    : locale === 'kn'
    ? 'SkillPassport ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ.'
    : 'Welcome to SkillPassport. Choose your preferred language to begin.';

  return (
    <PhoneFrame showBottomNav={false}>
      <div className="flex flex-col min-h-full justify-between bg-canvas relative overflow-hidden">
        
        {/* Top Header with Speaker Button */}
        <div className="p-4 flex items-center justify-between z-10">
          <Logo size="sm" showProduct={true} href="/" />
          <SpeakerButton textToRead={audioIntro} size="md" />
        </div>

        {/* Brand Tagline */}
        <div className="px-6 text-center z-10">
          <p className="text-xs font-bold text-orange tracking-wide uppercase">
            {t.tagline}
          </p>
        </div>

        {/* Worker Illustration (Matches Phone 1 in Showcase) */}
        <div className="relative my-4 flex items-center justify-center z-10 px-6">
          <div className="w-56 h-56 relative flex items-center justify-center">
            {/* Background circular swoosh */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-orange/40 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-blue-50 to-orange-50/50" />

            {/* Flat friendly worker vector illustration */}
            <svg viewBox="0 0 200 200" fill="none" className="w-48 h-48 drop-shadow-md relative z-10">
              {/* City skyline background */}
              <rect x="35" y="105" width="20" height="40" fill="#CBD5E1" opacity="0.6" />
              <rect x="60" y="90" width="25" height="55" fill="#94A3B8" opacity="0.5" />
              <rect x="120" y="85" width="22" height="60" fill="#94A3B8" opacity="0.5" />
              <rect x="145" y="100" width="20" height="45" fill="#CBD5E1" opacity="0.6" />

              {/* Worker Body / Safety Vest */}
              <path d="M100 135 C75 135 60 155 55 190 L145 190 C140 155 125 135 100 135 Z" fill="#F47B20" />
              <path d="M78 145 L85 190 M122 145 L115 190" stroke="#FFFFFF" strokeWidth="4" />
              <path d="M75 170 H125" stroke="#FFFFFF" strokeWidth="4" />

              {/* Neck & Face */}
              <rect x="92" y="120" width="16" height="18" fill="#FBBF24" rx="3" />
              <circle cx="100" cy="108" r="20" fill="#FDE68A" />
              {/* Eyes & Smile */}
              <circle cx="94" cy="106" r="2" fill="#0B2A5B" />
              <circle cx="106" cy="106" r="2" fill="#0B2A5B" />
              <path d="M96 114 C98 117 102 117 104 114" stroke="#0B2A5B" strokeWidth="2" strokeLinecap="round" />

              {/* Yellow Hard Hat */}
              <path d="M78 98 C78 82 88 72 100 72 C112 72 122 82 122 98 Z" fill="#FACC15" />
              <rect x="74" y="95" width="52" height="6" rx="3" fill="#EAB308" />

              {/* Thumbs up hand */}
              <g transform="translate(42, 125)">
                <circle cx="14" cy="14" r="12" fill="#FBBF24" />
                <path d="M14 6 V16 M10 11 H18" stroke="#0B2A5B" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 10 C12 6 15 5 16 8 L16 16" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="#FBBF24" />
              </g>
            </svg>
          </div>
        </div>

        {/* Language Selection Card (Matches Phone 1 in Showcase) */}
        <div className="p-6 bg-white rounded-t-3xl shadow-card border-t border-slate-100 z-10 space-y-4">
          <div className="text-center">
            <h2 className="text-base font-extrabold text-navy-primary">
              {t.screen1.chooseLanguage}
            </h2>
            <p className="text-xs text-content-secondary mt-0.5">
              {t.screen1.subtitle}
            </p>
          </div>

          {/* 3 Large Language Buttons (English, हिन्दी, ಕನ್ನಡ) */}
          <div className="space-y-2.5">
            {languages.map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-between text-base font-bold transition-all min-h-[52px] ${
                    isSelected
                      ? 'bg-navy-primary text-white shadow-button-navy scale-[1.01]'
                      : 'bg-white text-navy-primary border-2 border-slate-200 hover:border-navy-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className={`w-5 h-5 ${isSelected ? 'text-orange' : 'text-slate-400'}`} />
                    <span>{lang.label}</span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-orange text-white flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => router.push('/worker/verify')}
              className="w-full py-4 rounded-2xl bg-orange hover:bg-orange-hover text-white font-extrabold text-base shadow-button flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <span>{t.screen1.continue}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Curved Wave Graphic */}
        <div className="h-4 bg-orange/90 w-full" />

      </div>
    </PhoneFrame>
  );
}
