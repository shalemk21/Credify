'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { INITIAL_WORKERS, WAGE_ESTIMATES, GOV_SCHEMES, TRANSFERABLE_SKILLS_MAP } from '@/lib/db';
import {
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function GrowthPlanPage() {
  const { t, locale } = useI18n();
  const worker = INITIAL_WORKERS[0]; // Ramesh K.

  const wageInfo = WAGE_ESTIMATES.find(
    (w) => w.trade === worker.trade && w.level === worker.badgeLevel
  ) || WAGE_ESTIMATES[2];

  const audioText = locale === 'hi'
    ? 'आपकी तरक्की की योजना। सीखने के लिए अगला हुनर: एडवांस्ड इन्वर्टर डायग्नोस्टिक्स। संभावित कमाई में वृद्धि २० से ३० प्रतिशत।'
    : locale === 'kn'
    ? 'ನಿಮ್ಮ ಬೆಳವಣಿಗೆಯ ಯೋಜನೆ. ಮುಂದೆ ಕಲಿಯಬೇಕಾದ ಕೌಶಲ್ಯ: ಅಡ್ವಾನ್ಸ್ಡ್ ಇನ್ವರ್ಟರ್ ಡಯಾಗ್ನೋಸ್ಟಿಕ್ಸ್. ಸಂಭಾವ್ಯ ವೇತನ ಹೆಚ್ಚಳ ೨೦ ರಿಂದ ೩೦ ಪ್ರತಿಶತ.'
    : 'Your Growth Plan. Next skill to learn: Advanced Inverter Diagnostics. Potential wage uplift: 20 to 30 percent.';

  return (
    <PhoneFrame showBottomNav={true} backHref="/worker">
      <div className="p-4 space-y-4">
        
        {/* Top Header with Growth Icon (Matches Screen 8 in showcase) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-navy-primary/5 text-navy-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-navy-primary tracking-tight">
                {t.screen8.title}
              </h1>
              <p className="text-[11px] text-content-secondary">
                Tailored pathways to higher daily earnings
              </p>
            </div>
          </div>
          <SpeakerButton textToRead={audioText} size="md" />
        </div>

        {/* Growth Card Feature (Matches Screen 8 in showcase) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-4">
          
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-content-secondary block">
                {t.screen8.nextSkill}
              </span>
              <h2 className="text-lg font-black text-navy-primary leading-tight mt-1">
                Advanced Inverter Diagnostics
              </h2>
            </div>

            {/* Illustration of Worker Climbing Stairs / Flag (Matches Screen 8) */}
            <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                {/* Stairs */}
                <path d="M20 85 H40 V65 H60 V45 H80 V25" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
                {/* Target Flag */}
                <path d="M80 15 V30 M80 15 L95 20 L80 25 Z" fill="#F47B20" stroke="#F47B20" strokeWidth="2" />
                {/* Climber Figure */}
                <circle cx="58" cy="35" r="5" fill="#0B2A5B" />
                <path d="M58 40 V52 M54 45 H64 M58 52 L54 62 M58 52 L64 62" stroke="#0B2A5B" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Green Potential Wage Uplift Pill (Matches Screen 8) */}
          <div className="inline-flex items-center gap-1.5 bg-green-tint text-green-dark border border-green/30 px-3 py-1.5 rounded-full text-xs font-black">
            <CheckCircle2 className="w-3.5 h-3.5 text-green" />
            <span>{t.screen8.potentialWageUplift}</span>
          </div>

          <p className="text-xs text-content-secondary leading-relaxed font-medium">
            Bengaluru residential societies in Whitefield and Koramangala are actively upgrading to solar hybrid inverter backup systems.
          </p>

          {/* Navy CTA Button (Matches Screen 8) */}
          <Button
            href="https://www.skillindiadigital.gov.in"
            target="_blank"
            variant="primary"
            fullWidth
            size="md"
            icon={<ExternalLink className="w-4 h-4" />}
            iconPosition="right"
            className="font-bold text-xs"
          >
            {t.screen8.recommendedCourse}
          </Button>

        </div>

        {/* Transferable Skills Section (Matches Screen 8 in showcase) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange" />
            <h3 className="text-xs font-black text-navy-primary">
              {t.screen8.transferableSkills}
            </h3>
          </div>

          <div className="space-y-2.5">
            {TRANSFERABLE_SKILLS_MAP[worker.trade].map((path, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-navy-primary">
                    {path.source} → {path.target}
                  </h4>
                  <p className="text-[11px] text-content-secondary mt-0.5 leading-relaxed">
                    {path.rationale}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Wage Estimator (Section 10 #1) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-orange" />
              <h3 className="text-xs font-black text-navy-primary">
                {t.screen8.wageEstimator}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-navy-primary/70 bg-slate-100 px-2 py-0.5 rounded-full">
              {worker.locality}
            </span>
          </div>

          <div className="bg-gradient-to-r from-orange-light to-amber-50 p-3.5 rounded-2xl border border-orange/20 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-orange font-bold uppercase tracking-wider">
                Current {worker.badgeLevel} Tier Daily Rate
              </p>
              <h4 className="text-xl font-black text-navy-primary mt-0.5">
                ₹{wageInfo.minDailyWage} - ₹{wageInfo.maxDailyWage}
                <span className="text-xs text-content-secondary font-normal"> / day</span>
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-green-dark bg-white/80 px-2.5 py-1 rounded-full shadow-xs">
                Avg ₹{wageInfo.avgDailyWage}
              </span>
            </div>
          </div>
        </div>

        {/* Government Schemes Finder (Section 10 #4) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-navy-primary" />
            <h3 className="text-xs font-black text-navy-primary">
              {t.screen8.schemes}
            </h3>
          </div>

          <div className="space-y-2.5">
            {GOV_SCHEMES.map((scheme) => (
              <div
                key={scheme.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-navy-primary">
                    {scheme.name}
                  </h4>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-orange font-bold flex items-center gap-0.5 hover:underline"
                  >
                    <span>Apply</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-[11px] text-green-dark font-bold leading-tight">
                  Benefit: {scheme.benefits}
                </p>
                <p className="text-[10px] text-content-secondary">
                  Why you qualify: {scheme.whyQualify}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PhoneFrame>
  );
}
