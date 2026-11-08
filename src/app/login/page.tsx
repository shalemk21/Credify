'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Smartphone,
  ShieldAlert,
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/shared/Button';
import { DEMO_ACCOUNTS, saveStoredUser, UserRole } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');
  const redirectParam = searchParams.get('redirect');

  const [activeRole, setActiveRole] = useState<UserRole>(
    initialRoleParam === 'admin' ? 'admin' : 'employer'
  );

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Keep active role synced if query param changes
  useEffect(() => {
    if (initialRoleParam === 'admin' || initialRoleParam === 'employer') {
      setActiveRole(initialRoleParam);
    }
  }, [initialRoleParam]);

  // Handle Quick Demo Fill
  const handleQuickFill = (role: UserRole) => {
    setActiveRole(role);
    setErrorMessage('');
    if (role === 'employer') {
      setIdentifier(DEMO_ACCOUNTS.employer.email);
      setPassword(DEMO_ACCOUNTS.employer.defaultPassword);
      setAdminPin('');
    } else {
      setIdentifier(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.defaultPassword);
      setAdminPin(DEMO_ACCOUNTS.admin.securityPin);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    // Reset or update inputs cleanly
    if (role === 'employer') {
      setIdentifier(DEMO_ACCOUNTS.employer.email);
      setPassword(DEMO_ACCOUNTS.employer.defaultPassword);
    } else {
      setIdentifier(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.defaultPassword);
      setAdminPin(DEMO_ACCOUNTS.admin.securityPin);
    }
  };

  // Populate default on first mount
  useEffect(() => {
    if (activeRole === 'employer') {
      setIdentifier(DEMO_ACCOUNTS.employer.email);
      setPassword(DEMO_ACCOUNTS.employer.defaultPassword);
    } else {
      setIdentifier(DEMO_ACCOUNTS.admin.email);
      setPassword(DEMO_ACCOUNTS.admin.defaultPassword);
      setAdminPin(DEMO_ACCOUNTS.admin.securityPin);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        activeRole === 'employer'
          ? 'Please enter your organization email or registered phone number.'
          : 'Please enter your official Credify administrator email.'
      );
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    if (activeRole === 'admin' && adminPin.trim() && adminPin.trim() !== DEMO_ACCOUNTS.admin.securityPin) {
      setErrorMessage('Invalid 2FA Assessor Security Passcode. Use demo PIN: 882200');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against verified security registry
    setTimeout(() => {
      setIsLoading(false);

      if (activeRole === 'employer') {
        const user = {
          id: DEMO_ACCOUNTS.employer.id,
          role: 'employer' as UserRole,
          name: DEMO_ACCOUNTS.employer.name,
          email: identifier.includes('@') ? identifier : DEMO_ACCOUNTS.employer.email,
          phone: identifier.includes('@') ? DEMO_ACCOUNTS.employer.phone : identifier,
          organization: DEMO_ACCOUNTS.employer.organization,
          designation: DEMO_ACCOUNTS.employer.designation,
          avatar: DEMO_ACCOUNTS.employer.avatar,
          loginTime: new Date().toISOString(),
        };
        saveStoredUser(user);
        setSuccessMessage('Welcome back, Arun! Redirecting to Employer Dashboard...');
        setTimeout(() => {
          router.push(redirectParam || '/employer');
        }, 900);
      } else {
        const user = {
          id: DEMO_ACCOUNTS.admin.id,
          role: 'admin' as UserRole,
          name: DEMO_ACCOUNTS.admin.name,
          email: identifier.includes('@') ? identifier : DEMO_ACCOUNTS.admin.email,
          phone: DEMO_ACCOUNTS.admin.phone,
          organization: DEMO_ACCOUNTS.admin.organization,
          designation: DEMO_ACCOUNTS.admin.designation,
          avatar: DEMO_ACCOUNTS.admin.avatar,
          loginTime: new Date().toISOString(),
        };
        saveStoredUser(user);
        setSuccessMessage('Admin credentials verified. Redirecting to Moderation Portal...');
        setTimeout(() => {
          router.push(redirectParam || '/admin');
        }, 900);
      }
    }, 750);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Top Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-2 bg-slate-100/80 border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => handleRoleChange('employer')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-xs md:text-sm font-extrabold transition-all duration-200 ${
              activeRole === 'employer'
                ? 'bg-white text-navy-primary shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-navy-primary hover:bg-white/50'
            }`}
          >
            <Building2
              className={`w-4 h-4 ${
                activeRole === 'employer' ? 'text-orange' : 'text-slate-400'
              }`}
            />
            <span>Employer / Contractor</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-xs md:text-sm font-extrabold transition-all duration-200 ${
              activeRole === 'admin'
                ? 'bg-navy-primary text-white shadow-button-navy'
                : 'text-slate-600 hover:text-navy-primary hover:bg-white/50'
            }`}
          >
            <ShieldCheck
              className={`w-4 h-4 ${
                activeRole === 'admin' ? 'text-green' : 'text-slate-400'
              }`}
            />
            <span>Admin / Assessor</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Header Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                  activeRole === 'employer'
                    ? 'bg-orange-light text-orange border border-orange/20'
                    : 'bg-green/10 text-green-dark border border-green/20'
                }`}
              >
                {activeRole === 'employer' ? 'Talent Acquisition' : 'Platform Authority'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-navy-primary tracking-tight">
              {activeRole === 'employer'
                ? 'Employer & Recruiter Sign In'
                : 'Credify Administrator Login'}
            </h2>
            <p className="text-xs md:text-sm text-content-secondary mt-1">
              {activeRole === 'employer'
                ? 'Search verified blue-collar tradespeople, review trust scorecards, and send instant hire requests.'
                : 'Review flagged vouches, manage SkillPassport authenticity, and oversee platform verification.'}
            </p>
          </div>

          {/* Quick Demo Login Pill Bar */}
          <div className="bg-canvas rounded-2xl p-3 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-orange shrink-0" />
              <span className="font-bold text-navy-primary">Quick Demo Access:</span>
              <span className="text-slate-500">
                {activeRole === 'employer' ? 'ABC Contractors (Arun B.)' : 'Directorate (Dr. Sunita)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill(activeRole)}
              className="text-xs font-extrabold text-orange hover:text-orange-hover hover:underline transition-all inline-flex items-center gap-1"
            >
              <span>Auto-Fill Demo Credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-green-tint border border-green/30 text-green-dark text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-bold text-navy-primary mb-1.5">
                {activeRole === 'employer'
                  ? 'Official Email or Registered Mobile Number'
                  : 'Administrator Email or Authority ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {activeRole === 'employer' ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    activeRole === 'employer'
                      ? 'e.g., employer@credify.in or +91 98450 11223'
                      : 'e.g., admin@credify.in'
                  }
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-canvas/40 text-navy-primary font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-primary/20 focus:border-navy-primary transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-navy-primary">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-bold text-orange hover:text-orange-hover hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-canvas/40 text-navy-primary font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-primary/20 focus:border-navy-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-navy-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Admin-only Security PIN (2FA Simulation) */}
            {activeRole === 'admin' && (
              <div className="p-3.5 rounded-2xl bg-navy-primary/5 border border-navy-primary/10 space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-navy-primary flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-navy-primary" />
                    <span>Assessor 2FA Passcode / Security PIN</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Demo: 882200
                  </span>
                </div>
                <input
                  type="text"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="6-digit security PIN (882200)"
                  maxLength={8}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold text-navy-primary tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-navy-primary/20 focus:border-navy-primary"
                />
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-orange focus:ring-orange/30 rounded"
                />
                <span>Remember this terminal for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant={activeRole === 'employer' ? 'orange' : 'primary'}
              size="lg"
              fullWidth
              loading={isLoading}
              className="mt-2 text-sm md:text-base font-extrabold"
            >
              {activeRole === 'employer'
                ? 'Sign In to Employer Portal'
                : 'Authenticate Admin Access'}
            </Button>

            {activeRole === 'employer' && (
              <div className="pt-2 text-center text-xs">
                <span className="text-slate-500">New contractor or enterprise? </span>
                <Link
                  href="/employer/register"
                  className="font-extrabold text-orange hover:text-orange-hover hover:underline"
                >
                  Register Account (Admin Approval Required) →
                </Link>
              </div>
            )}
          </form>

          {/* Quick Demo switcher buttons at bottom */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Need immediate test access?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('employer')}
                className="text-xs font-bold text-orange hover:underline"
              >
                Employer 1-Click
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="text-xs font-bold text-navy-primary hover:underline"
              >
                Admin 1-Click
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-orange-light text-orange flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-navy-primary text-lg">Reset Password</h3>
              <p className="text-xs text-content-secondary mt-1">
                For the live evaluation sandbox, demo accounts are pre-configured:
              </p>
            </div>
            <div className="bg-canvas rounded-2xl p-3 text-xs space-y-2 border border-slate-200/80">
              <div className="font-bold text-navy-primary">Employer Demo:</div>
              <div className="text-slate-600 font-mono text-[11px]">employer@credify.in / password123</div>
              <div className="font-bold text-navy-primary pt-1">Admin Demo:</div>
              <div className="text-slate-600 font-mono text-[11px]">admin@credify.in / admin123 (PIN: 882200)</div>
            </div>
            <Button
              type="button"
              variant="primary"
              fullWidth
              size="md"
              onClick={() => setShowForgotModal(false)}
            >
              Got it, close
            </Button>
          </div>
        </div>
      )}

      {/* Worker Portal Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-light text-orange flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-navy-primary">
              Are you a Skilled Tradesperson or Worker?
            </h4>
            <p className="text-[11px] text-content-secondary">
              Workers don&apos;t require passwords — onboard with voice & mobile OTP
            </p>
          </div>
        </div>
        <Link
          href="/worker/onboarding"
          className="text-xs font-bold text-orange hover:text-orange-hover hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Worker PWA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between selection:bg-orange/20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" href="/" />

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs md:text-sm font-bold text-navy-primary hover:text-orange transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Button
              href="/worker/onboarding"
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex text-xs"
            >
              Worker Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-12 py-8 md:py-12 flex flex-col justify-center">
        <Suspense fallback={
          <div className="max-w-md mx-auto p-12 text-center text-slate-500 font-bold text-sm">
            Loading secure authentication portal...
          </div>
        }>
          <LoginForm />
        </Suspense>

        {/* Security / Compliance Strip */}
        <div className="mt-8 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green" />
            <span>256-Bit Cryptographic Trust</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-orange" />
            <span>Role-Based Secure Access</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy-dark text-white/80 py-5 text-xs text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo variant="dark" size="sm" showProduct={false} />
            <span>— Bengaluru Workforce Trust Layer</span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/worker/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/employer" className="hover:text-white">Employer Dashboard</Link>
            <Link href="/admin" className="hover:text-orange">Admin Controls</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

