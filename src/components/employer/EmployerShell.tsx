'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  BookmarkCheck,
  GitCompare,
  Send,
  BarChart3,
  Settings,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Smartphone
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { NotificationCenter } from '@/components/shared/NotificationCenter';

interface EmployerShellProps {
  children: React.ReactNode;
}

export const EmployerShell: React.FC<EmployerShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/employer', icon: LayoutDashboard },
    { label: 'Search Talent', href: '/employer#search', icon: Search },
    { label: 'Shortlist', href: '/employer/shortlist', icon: BookmarkCheck },
    { label: 'Compare', href: '/employer/compare', icon: GitCompare },
    { label: 'Hire Requests', href: '/employer/hire-requests', icon: Send },
    { label: 'Analytics', href: '/employer/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/employer/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      {/* Dark Navy Sidebar (matches Screen 5 in showcase) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-deep text-white flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Top Brand Logo */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Logo variant="dark" size="md" href="/" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-white/70 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-orange text-white shadow-button'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Cross-Portal Links */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Cross Portal Mobile Switcher Links (Requirement 1) */}
          <Link
            href="/worker"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-orange-light/10 hover:bg-orange-light/20 text-xs text-orange font-bold transition-colors border border-orange/20"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>👷 Switch to Worker PWA</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-blue-200 font-bold transition-colors border border-white/10"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green" />
              <span>🛡️ Admin Controls</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Business Profile Chip */}
          <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/5 mt-2">
            <div className="w-8 h-8 rounded-full bg-orange/20 border border-orange/40 text-orange flex items-center justify-center font-bold text-xs shrink-0">
              AB
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">ABC Contractors</p>
              <p className="text-[10px] text-slate-300 truncate">Bengaluru</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-navy-primary p-1.5 rounded-lg hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-black text-navy-primary tracking-tight">
                Employer Dashboard
              </h1>
              <p className="text-xs text-content-secondary hidden sm:block">
                Find verified and trusted talent in Bengaluru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-navy-primary/80 hover:text-navy-primary bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-green" />
              <span>Admin Controls</span>
            </Link>

            <Link
              href="/worker"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-orange bg-orange-light/30 px-3 py-1.5 rounded-full border border-orange/20 hover:bg-orange-light/50 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Worker PWA</span>
            </Link>

            {/* Working Interactive Notification Center (Requirement 4) */}
            <NotificationCenter align="right" />

            <div className="w-8 h-8 rounded-full bg-navy-primary text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-100">
              AB
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
