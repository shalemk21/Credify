'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  FileCheck,
  Award,
  Briefcase,
  TrendingUp,
  Smartphone,
  ArrowLeft,
  Shield,
  ChevronDown,
  Building2,
  ShieldCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { QRCard } from '@/components/shared/QRCard';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
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
  const router = useRouter();
  const { t } = useI18n();
  const [portalSwitcherOpen, setPortalSwitcherOpen] = useState(false);

  // Determine active tab
  const tabs = [
    { label: t.tabs.home, href: '/worker', icon: Home },
    { label: t.tabs.evidence, href: '/worker/evidence', icon: FileCheck },
    { label: t.tabs.passport, href: '/worker/passport', icon: Award },
    { label: t.tabs.jobs, href: '/worker/jobs', icon: Briefcase },
    { label: t.tabs.growth, href: '/worker/growth', icon: TrendingUp },
  ];

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000/worker';

  // Automatically determine back button target if not on worker home
  const effectiveBackHref = backHref || (pathname !== '/worker' ? '/worker' : undefined);

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

          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/employer"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange hover:text-white transition-colors"
            >
              ← Switch to Employer Dashboard
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              🛡️ Open Admin Controls
            </Link>
          </div>
        </div>

        {/* Centered Phone-Width Column (max 420px on desktop) */}
        <div className="w-full max-w-md lg:max-w-[420px] min-h-screen lg:min-h-[820px] lg:max-h-[880px] bg-canvas flex flex-col lg:rounded-[40px] lg:border-[8px] lg:border-slate-800 lg:shadow-2xl overflow-hidden relative">
          
          {/* iOS / Android Status Bar simulation */}
          <div className="pt-2 px-6 pb-1 bg-white/90 backdrop-blur-sm flex justify-between items-center text-[11px] font-semibold text-slate-800 select-none border-b border-slate-100/60 z-20">
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

          {/* Mobile Top Navigation & Portal Switcher Bar */}
          <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between z-20 gap-2">
            {/* Left: Back Button or Home Icon */}
            <div className="w-9 flex items-center">
              {effectiveBackHref ? (
                <Link
                  href={effectiveBackHref}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-navy-primary transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </Link>
              ) : (
                <span className="text-xs font-black text-navy-primary px-1">👷</span>
              )}
            </div>

            {/* Center: Mobile Portal Switcher Button */}
            <button
              type="button"
              onClick={() => setPortalSwitcherOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-primary/5 hover:bg-navy-primary/10 text-navy-primary text-xs font-bold transition-all border border-navy-primary/10 active:scale-95"
              title="Switch portal view"
            >
              <span>👷 Worker PWA</span>
              <ChevronDown className="w-3.5 h-3.5 text-orange" />
            </button>

            {/* Right: Working Notification Center */}
            <div className="w-9 flex items-center justify-end">
              <NotificationCenter align="right" />
            </div>
          </div>

          {/* Subheader if title is provided */}
          {title && (
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-center">
              <h1 className="text-xs font-bold text-navy-primary truncate">
                {title}
              </h1>
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

          {/* Mobile Portal Switcher Drawer / Modal */}
          {portalSwitcherOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
              <div className="bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-black text-navy-primary">
                    Switch Credify Portal
                  </h3>
                  <button
                    type="button"
                    onClick={() => setPortalSwitcherOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-navy-primary hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/worker"
                    onClick={() => setPortalSwitcherOpen(false)}
                    className="p-3.5 rounded-2xl bg-orange-light/30 border border-orange/40 flex items-center justify-between hover:bg-orange-light/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange text-white flex items-center justify-center font-bold">
                        👷
                      </div>
                      <div>
                        <p className="text-xs font-black text-navy-primary">Worker PWA</p>
                        <p className="text-[10px] text-slate-500">Skills, Evidence, Digital Passport</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-orange uppercase tracking-wider">Active</span>
                  </Link>

                  <Link
                    href="/employer"
                    onClick={() => setPortalSwitcherOpen(false)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-primary text-white flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-navy-primary">Employer Dashboard</p>
                        <p className="text-[10px] text-slate-500">Search, Compare, Hire Requests</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setPortalSwitcherOpen(false)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-navy-primary">Admin Control Panel</p>
                        <p className="text-[10px] text-slate-500">Assessor audits & vouch moderation</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/passport/worker-ramesh-k"
                    onClick={() => setPortalSwitcherOpen(false)}
                    className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs font-bold text-navy-primary hover:bg-blue-50"
                  >
                    <span>📜 View Public Passport (Ramesh K.)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-navy-primary" />
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
