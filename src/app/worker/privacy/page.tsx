'use client';

import React, { useState } from 'react';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { INITIAL_WORKERS } from '@/lib/db';
import { Shield, Lock, Eye, Building2, CheckCircle2, Clock } from 'lucide-react';

export default function WorkerPrivacyPage() {
  const worker = INITIAL_WORKERS[0];

  const [showPhone, setShowPhone] = useState(worker.privacySettings.showPhone);
  const [showLocation, setShowLocation] = useState(worker.privacySettings.showLocation);
  const [showVideos, setShowVideos] = useState(worker.privacySettings.showVideos);
  const [consentGranted, setConsentGranted] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <PhoneFrame showBottomNav={true} backHref="/worker" title="Privacy & Consent">
      <div className="p-4 space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-tint text-green flex items-center justify-center">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-black text-navy-primary tracking-tight">
                Data Privacy & Control
              </h1>
              <p className="text-[11px] text-content-secondary">
                Digital Personal Data Protection (DPDP) Act, 2023
              </p>
            </div>
          </div>
          <SpeakerButton
            textToRead="Data privacy settings. Control what information employers can see and review who viewed your profile."
            size="md"
          />
        </div>

        {/* DPDP Act Explicit Consent Copy */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-3">
          <h2 className="text-xs font-black text-navy-primary flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-orange" />
            <span>DPDP Act Worker Consent Notice</span>
          </h2>
          <p className="text-xs text-content-secondary leading-relaxed font-medium">
            Your skill evidence and vouches belong solely to you. You maintain complete sovereignty to revoke consent, mask your mobile number, or hide site GPS coordinates from employers at any time.
          </p>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGranted}
              onChange={(e) => setConsentGranted(e.target.checked)}
              className="rounded text-orange focus:ring-orange w-4 h-4"
            />
            <span className="text-xs font-bold text-navy-primary">
              I authorize Credify to showcase my verified skills to verified contractors
            </span>
          </label>
        </div>

        {/* Visibility Toggles */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-xs font-black text-navy-primary">
            Employer Visibility Toggles
          </h2>

          <div className="space-y-3 text-xs font-bold text-navy-primary">
            <div className="flex items-center justify-between py-1">
              <div>
                <p>Show Phone Number</p>
                <p className="text-[10px] text-slate-400 font-normal">Allow direct WhatsApp & calls</p>
              </div>
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="w-5 h-5 rounded text-orange focus:ring-orange cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100">
              <div>
                <p>Show Exact Site Coordinates</p>
                <p className="text-[10px] text-slate-400 font-normal">Allow distance calculation from sites</p>
              </div>
              <input
                type="checkbox"
                checked={showLocation}
                onChange={(e) => setShowLocation(e.target.checked)}
                className="w-5 h-5 rounded text-orange focus:ring-orange cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100">
              <div>
                <p>Show Work Videos</p>
                <p className="text-[10px] text-slate-400 font-normal">Show unedited task demonstration recordings</p>
              </div>
              <input
                type="checkbox"
                checked={showVideos}
                onChange={(e) => setShowVideos(e.target.checked)}
                className="w-5 h-5 rounded text-orange focus:ring-orange cursor-pointer"
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSave}
            variant="primary"
            fullWidth
            size="md"
            className="font-bold text-xs"
          >
            {savedSuccess ? 'Preferences Saved ✓' : 'Save Privacy Settings'}
          </Button>
        </div>

        {/* Who Viewed My Profile Log (Section 6 #9) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange" />
              <h2 className="text-xs font-black text-navy-primary">
                Who Viewed My Profile
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Transparency Log
            </span>
          </div>

          <div className="space-y-2">
            {worker.profileViews.map((view, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-navy-primary shrink-0" />
                  <span className="font-bold text-navy-primary">{view.viewedByCompany}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {view.viewedAt.slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PhoneFrame>
  );
}
