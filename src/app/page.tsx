'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Handshake,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';
import { WorkerShieldIllustration } from '@/components/landing/WorkerShieldIllustration';
import { useI18n } from '@/lib/i18n';

export default function LandingPage() {
  const { t, locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { label: t.stats.talentsDiscovered, icon: Users, value: '2,450+' },
    { label: t.stats.successfulMatches, icon: Handshake, value: '98%' },
    { label: t.stats.trustedVerified, icon: ShieldCheck, value: '100%' },
    { label: t.stats.acrossIndia, icon: MapPin, value: 'Bengaluru' },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between selection:bg-orange/20">
      {/* Top Navigation Bar (matches top-left of showcase image) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" href="/" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-content-primary">
            <Link href="/" className="text-orange transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/worker/jobs" className="hover:text-navy-primary transition-colors">
              {t.nav.opportunities}
            </Link>
            <Link href="#mission" className="hover:text-navy-primary transition-colors">
              {t.nav.mission}
            </Link>
            <Link href="#about" className="hover:text-navy-primary transition-colors">
              {t.nav.about}
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Language Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold text-navy-primary mr-2">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2 py-1 rounded-lg transition-colors ${locale === 'en' ? 'bg-white shadow-xs' : 'text-slate-500'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('hi')}
                className={`px-2 py-1 rounded-lg transition-colors ${locale === 'hi' ? 'bg-white shadow-xs' : 'text-slate-500'}`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLocale('kn')}
                className={`px-2 py-1 rounded-lg transition-colors ${locale === 'kn' ? 'bg-white shadow-xs' : 'text-slate-500'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <Button href="/login" variant="outline" size="md">
              {t.nav.login}
            </Button>
            <Button href="/worker/onboarding" variant="orange" size="md">
              {t.nav.getStarted}
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-navy-primary p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 px-4 space-y-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2 justify-center py-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${locale === 'en' ? 'bg-navy-primary text-white' : 'bg-slate-100'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLocale('hi')}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${locale === 'hi' ? 'bg-navy-primary text-white' : 'bg-slate-100'}`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLocale('kn')}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${locale === 'kn' ? 'bg-navy-primary text-white' : 'bg-slate-100'}`}
              >
                ಕನ್ನಡ
              </button>
            </div>
            <nav className="flex flex-col gap-3 font-semibold text-sm">
              <Link href="/worker/onboarding" onClick={() => setMobileMenuOpen(false)} className="text-orange">
                Worker Onboarding (SkillPassport)
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-navy-primary font-bold">
                Employer & Admin Sign In
              </Link>
              <Link href="/employer" onClick={() => setMobileMenuOpen(false)} className="text-slate-600">
                Employer Dashboard
              </Link>
              <Link href="/worker/passport" onClick={() => setMobileMenuOpen(false)} className="text-slate-600">
                View Demo Passport
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-slate-600">
                Admin Demo Panel
              </Link>
            </nav>
            <div className="flex flex-col gap-2 pt-2">
              <Button href="/worker/onboarding" variant="orange" fullWidth>
                {t.nav.getStarted}
              </Button>
              <Button href="/login" variant="outline" fullWidth>
                {t.nav.login}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section (matches top-left showcase design) */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-16 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Platform Brand + Product Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-light border border-orange/20 text-orange font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>{t.tagline}</span>
            </div>

            {/* Product Title matching visual showcase */}
            <div className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none">
              <span className="text-navy-primary">Skill</span>
              <span className="text-orange">Passport</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy-primary tracking-tight leading-tight">
              {t.heroHeadline}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-content-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                href="/worker/onboarding"
                variant="orange"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="w-full sm:w-auto text-base"
              >
                {t.nav.exploreTalent} →
              </Button>

              <Button
                href="/employer"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base"
              >
                {t.nav.forEmployers}
              </Button>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-content-secondary">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green" />
                <span>Voice-first PWA (Hindi & Kannada)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green" />
                <span>Public QR Verification (No login)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Illustration of workers framed in shield */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md lg:max-w-none">
              <WorkerShieldIllustration className="transform hover:scale-102 transition-transform duration-300" />
            </div>
          </div>

        </div>
      </section>

      {/* Bottom Stats Strip (matches bottom strip in top-left showcase) */}
      <section className="w-full bg-white border-t border-slate-200/90 py-6 md:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-canvas/60 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-navy-primary/5 text-navy-primary flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-extrabold text-navy-primary">
                      {st.label}
                    </div>
                    <div className="text-xs text-content-secondary font-medium">
                      Verified & Active
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-white/80 py-6 text-xs text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo variant="dark" size="sm" showProduct={false} />
            <span>— The Invisible Workforce Trust Layer</span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <Link href="/worker/privacy" className="hover:text-white">DPDP Act Privacy</Link>
            <Link href="/passport/worker-ramesh-k" className="hover:text-white">Sample Public Passport</Link>
            <Link href="/login" className="hover:text-white">Sign In</Link>
            <Link href="/admin" className="hover:text-orange">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
