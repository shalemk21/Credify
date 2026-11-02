'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { Logo } from '@/components/shared/Logo';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { TrustRing } from '@/components/shared/TrustRing';
import { Chip } from '@/components/shared/Chip';
import { QRCard } from '@/components/shared/QRCard';
import { EvidenceGallery } from '@/components/shared/EvidenceGallery';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { INITIAL_WORKERS } from '@/lib/db';
import { Share2, Download, ShieldCheck, CheckCircle2, UserPlus, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';

export default function WorkerPassportPage() {
  const { t, locale } = useI18n();
  const worker = INITIAL_WORKERS[0]; // Ramesh K. (matches showcase visual)

  const [shareSuccess, setShareSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/passport/${worker.id}`
    : `http://localhost:3000/passport/${worker.id}`;

  const audioText = locale === 'hi'
    ? `${worker.name} का स्किल पासपोर्ट। भरोसा स्कोर ${worker.trustScore}। ${worker.yearsOfExperience} साल का अनुभव और ${worker.vouches.length} वाउच।`
    : locale === 'kn'
    ? `${worker.name} ಅವರ ಸ್ಕಿಲ್ ಪಾಸ್‌ಪೋರ್ಟ್. ವಿಶ್ವಾಸ ಅಂಕ ${worker.trustScore}. ${worker.yearsOfExperience} ವರ್ಷಗಳ ಅನುಭವ.`
    : `Skill Passport for ${worker.name}. Trust score ${worker.trustScore} with ${worker.yearsOfExperience} years experience and ${worker.vouches.length} verified vouches.`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${worker.name}'s Verified SkillPassport`,
          text: `Check out ${worker.name}'s evidence-backed SkillPassport on Credify (Trust Score: ${worker.trustScore})`,
          url: publicUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(publicUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Background header
      doc.setFillColor(11, 42, 91); // Primary navy
      doc.rect(0, 0, 210, 50, 'F');

      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('Credify SkillPassport', 20, 25);
      doc.setFontSize(12);
      doc.setTextColor(244, 123, 32); // Orange
      doc.text('Your Skills. Our Recognition. — Verified National Credential', 20, 35);

      // Body Details
      doc.setTextColor(15, 27, 51);
      doc.setFontSize(18);
      doc.text(worker.name, 20, 65);
      doc.setFontSize(12);
      doc.setTextColor(91, 107, 132);
      doc.text(`${worker.trade} • ${worker.locality}, Bengaluru`, 20, 73);

      // Scores
      doc.setFontSize(14);
      doc.setTextColor(46, 158, 91);
      doc.text(`Trust Score: ${worker.trustScore}/100 (Gold Tier)`, 20, 88);
      doc.setTextColor(15, 27, 51);
      doc.text(`Experience: ${worker.yearsOfExperience} Years | Vouches: ${worker.vouches.length} Verified`, 20, 96);

      // Verified Skills
      doc.setFontSize(12);
      doc.text('Verified Skills:', 20, 110);
      doc.setFontSize(11);
      doc.setTextColor(46, 158, 91);
      doc.text(worker.verifiedSkills.join(', '), 20, 118);

      // Vouches summary
      doc.setTextColor(15, 27, 51);
      doc.setFontSize(12);
      doc.text('Vouch Endorsements:', 20, 135);
      doc.setFontSize(10);
      doc.setTextColor(91, 107, 132);
      let yPos = 145;
      worker.vouches.forEach((v) => {
        doc.text(`• ${v.vouchedByName} (${v.role}): "${v.comment}"`, 20, yPos);
        yPos += 10;
      });

      // Verification footer
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Public Verification Link: ${publicUrl}`, 20, 270);
      doc.text('Powered by Credify Trust Layer — Government DPDP Act Compliant', 20, 276);

      doc.save(`SkillPassport_${worker.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PhoneFrame showBottomNav={true}>
      <div className="p-4 space-y-4">
        
        {/* Skill Passport Main Card (Matches Screen 6 in showcase) */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-card">
          
          {/* Navy Top Card Header with Orange Swoosh (Matches Screen 6) */}
          <div className="bg-navy-primary p-4 pb-14 text-white relative overflow-hidden">
            {/* Orange swoosh curve */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange/90 rounded-full blur-xs" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full" />

            <div className="flex items-center justify-between relative z-10">
              <Logo variant="dark" size="sm" showProduct={true} href="/" />
              <SpeakerButton textToRead={audioText} size="sm" />
            </div>
          </div>

          {/* Profile Card Body */}
          <div className="px-5 pb-6 pt-0 relative">
            
            {/* Circular Avatar Photo overlapping header */}
            <div className="-mt-11 flex justify-between items-end mb-3">
              <div className="relative">
                <img
                  src={worker.avatarUrl}
                  alt={worker.name}
                  className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-slate-100"
                />
                {worker.safetyAware && (
                  <span
                    title="Safety Aware Certified"
                    className="absolute bottom-0 right-0 bg-green text-white p-1 rounded-full ring-2 ring-white shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Gold Badge Pill */}
              <div className="mb-2">
                <BadgeLevel level={worker.badgeLevel} size="md" />
              </div>
            </div>

            {/* Name & Locality */}
            <div>
              <h2 className="text-xl font-black text-navy-primary tracking-tight">
                {worker.name}
              </h2>
              <p className="text-xs text-content-secondary font-medium">
                {worker.trade === 'ELECTRICIAN' ? 'Electrician' : 'Plumber'} • {worker.locality}, Bengaluru
              </p>
            </div>

            {/* Three Key Stat Columns & QR Code (Matches Screen 6 in Showcase) */}
            <div className="grid grid-cols-12 gap-3 my-4 py-3 border-y border-slate-100 items-center">
              
              {/* TrustRing */}
              <div className="col-span-4 flex justify-center">
                <TrustRing score={worker.trustScore} size={74} strokeWidth={5.5} label="Trust Score" />
              </div>

              {/* Experience & Vouches */}
              <div className="col-span-4 space-y-2 text-center border-x border-slate-100 px-1">
                <div>
                  <span className="text-base font-black text-navy-primary block leading-tight">
                    {worker.yearsOfExperience} Years
                  </span>
                  <span className="text-[10px] text-content-secondary font-semibold">
                    Experience
                  </span>
                </div>
                <div>
                  <span className="text-base font-black text-navy-primary block leading-tight">
                    {worker.vouches.length} Vouches
                  </span>
                  <span className="text-[10px] text-content-secondary font-semibold">
                    Client Verified
                  </span>
                </div>
              </div>

              {/* Large QR Code on Right (Matches Screen 6 in Showcase) */}
              <div className="col-span-4 flex justify-center">
                <QRCard url={publicUrl} size={72} label="Scan to Verify" />
              </div>

            </div>

            {/* Verified Skills Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-navy-primary block">
                {t.screen6.verifiedSkills}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {worker.verifiedSkills.slice(0, 3).map((skill) => (
                  <Chip key={skill} label={skill} variant="green" size="sm" />
                ))}
                {worker.verifiedSkills.length > 3 && (
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    +{worker.verifiedSkills.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Two Action Buttons: Share (Navy) & Download PDF (Orange) */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button
                type="button"
                onClick={handleShare}
                variant="primary"
                size="md"
                icon={<Share2 className="w-4 h-4" />}
                className="font-bold text-xs"
              >
                {shareSuccess ? 'Link Copied!' : t.screen6.share}
              </Button>

              <Button
                type="button"
                onClick={handleDownloadPDF}
                variant="orange"
                size="md"
                loading={downloading}
                icon={<Download className="w-4 h-4" />}
                className="font-bold text-xs"
              >
                {t.screen6.downloadPdf}
              </Button>
            </div>

          </div>
        </div>

        {/* Work Evidence Preview Gallery */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-navy-primary">
              Work Evidence Gallery ({worker.evidence.length})
            </h3>
            <Link href="/worker/evidence" className="text-[11px] font-bold text-orange hover:underline">
              + Add More
            </Link>
          </div>
          <EvidenceGallery items={worker.evidence} showPreview={false} />
        </div>

        {/* Get Vouched CTA Card (Matches Section 6 #6) */}
        <div className="bg-gradient-to-r from-navy-primary to-navy-light text-white rounded-3xl p-4 flex items-center justify-between shadow-button-navy">
          <div>
            <h4 className="text-xs font-bold">Request a Client Vouch</h4>
            <p className="text-[10px] text-blue-200 mt-0.5">Send a WhatsApp link to past homeowners</p>
          </div>
          <Link
            href={`/vouch/token-${worker.id}`}
            className="bg-orange hover:bg-orange-hover text-white text-xs font-extrabold px-3 py-2 rounded-xl shadow-button shrink-0"
          >
            Get Vouched →
          </Link>
        </div>

      </div>
    </PhoneFrame>
  );
}
