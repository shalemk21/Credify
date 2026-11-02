'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileCheck, Award, Briefcase, TrendingUp, Smartphone, ArrowLeft, Shield } from 'lucide-react';
import { QRCard } from '@/components/shared/QRCard';
import { useI18n } from '@/lib/i18n';

interface PhoneFrameProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  backHref?: string;
  title?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  showBottomNav = true,
  backHref,
  title,
}) => {
  const pathname = usePathname();
  const { t } = useI18n();

  // Determine active tab
  const tabs = [
    { label: t.tabs.home, href: '/worker', icon: Home },
    { label: t.tabs.evidence, href: '/worker/evidence', icon: FileCheck },
    { label: t.tabs.passport, href: '/worker/passport', icon: Award },
    { label: t.tabs.jobs, href: '/worker/jobs', icon: Briefcase },
    { label: t.tabs.growth, href: '/worker/growth', icon: TrendingUp },
  ];

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000/worker';

  return (
    <div className="min-h-screen bg-slate-900/5 lg:bg-[#0A2147]/95 flex items-center justify-center p-0 lg:p-6 transition-colors">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* Desktop Side Explanation Panel (Shown only on lg screens) */}
        <div className="hidden lg:flex flex-col max-w-sm text-white space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange flex items-center justify-center text-white shadow-button">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Worker PWA Preview</h2>
              <p className="text-xs text-blue-200">Mobile-First Experience</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Workers experience a lightweight, voice-first PWA designed for non-English speakers. 
            Every screen includes <strong>audio-read assistance</strong>, visual scenario assessments, 
            and offline-first work evidence capture.
          </p>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
            <QRCard url={currentUrl} size={90} label="Scan to Open" className="bg-white p-2 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-white">Open on your phone</p>
              <p className="text-slate-300">Scan this QR code with your mobile camera to test speech and camera hardware directly.</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green" />
              <span>DPDP Act compliant data consent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange"></span>
              <span>Available offline with service worker</span>
            </div>
          </div>

          <div className="pt-3">
            <Link
              href="/employer"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange hover:text-white transition-colors"
            >
              ← Switch to Employer Dashboard
            </Link>
          </div>
        </div>

        {/* Centered Phone-Width Column (max 420px on desktop) */}
        <div className="w-full max-w-md lg:max-w-[420px] min-h-screen lg:min-h-[820px] lg:max-h-[880px] bg-canvas flex flex-col lg:rounded-[40px] lg:border-[8px] lg:border-slate-800 lg:shadow-2xl overflow-hidden relative">
          
          {/* iOS / Android Status Bar simulation */}
          <div className="pt-2 px-6 pb-1 bg-white/80 backdrop-blur-sm flex justify-between items-center text-[11px] font-semibold text-slate-800 select-none border-b border-slate-100/60 z-20">
            <span>9:41</span>
            <div className="w-20 h-4 bg-slate-900/10 rounded-full flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-slate-800/40"></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2 border border-slate-800 rounded-sm p-0.5">
                <div className="h-full bg-slate-800 rounded-xs"></div>
              </div>
            </div>
          </div>

          {/* Optional Header with Back Button */}
          {(backHref || title) && (
            <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between z-10">
              {backHref ? (
                <Link
                  href={backHref}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-navy-primary transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </Link>
              ) : (
                <div className="w-8" />
              )}
              {title && (
                <h1 className="text-sm font-bold text-navy-primary text-center truncate max-w-[240px]">
                  {title}
                </h1>
              )}
              <div className="w-8" />
            </div>
          )}

          {/* Scrollable Screen Content */}
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>

          {/* Persistent Bottom Tab Navigation (after onboarding) */}
          {showBottomNav && (
            <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex justify-around items-center z-30 select-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'text-navy-primary font-bold scale-105'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-navy-primary' : 'stroke-[1.75]'}`} />
                    <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                    {isActive && (
                      <span className="w-1 h-1 bg-orange rounded-full mt-0.5 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

        </div>
      </div>
    </div>
  );
};
