'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { ProgressDots } from '@/components/shared/ProgressDots';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { EvidenceGallery } from '@/components/shared/EvidenceGallery';
import { useI18n } from '@/lib/i18n';
import { queueEvidenceOffline } from '@/lib/offline';
import { WorkEvidence } from '@/types';
import { Upload, Camera, CheckCircle2, ShieldCheck, MapPin, ArrowRight, WifiOff, Sparkles } from 'lucide-react';

export default function WorkEvidencePage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [evidenceList, setEvidenceList] = useState<WorkEvidence[]>([
    {
      id: 'demo-ev-1',
      workerId: 'worker-demo',
      title: '3-Phase Distribution Board Wiring & MCBs',
      mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80',
      type: 'photo',
      timestamp: '2026-03-15 11:30:00',
      location: 'Whitefield Project Site',
      verified: true,
    },
    {
      id: 'demo-ev-2',
      workerId: 'worker-demo',
      title: 'Inverter Battery Backup Installation',
      mediaUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&auto=format&fit=crop&q=80',
      type: 'photo',
      timestamp: '2026-03-12 14:20:00',
      location: 'ECC Road, Bengaluru',
      verified: true,
    },
    {
      id: 'demo-ev-3',
      workerId: 'worker-demo',
      title: 'Conduit Piping & Wall Chase Work',
      mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
      type: 'photo',
      timestamp: '2026-03-08 16:45:00',
      location: 'Hope Farm, Bengaluru',
      verified: true,
    },
  ]);

  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [offlineToast, setOfflineToast] = useState('');

  const audioPrompt = locale === 'hi'
    ? 'काम का सबूत जोड़ें। अपने काम की तस्वीरें या वीडियो अपलोड करें।'
    : locale === 'kn'
    ? 'ನಿಮ್ಮ ಕೆಲಸದ ಸಾಕ್ಷ್ಯ ಸೇರಿಸಿ. ಫೋಟೋ ಅಥವಾ ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.'
    : 'Add work evidence. Upload photos or videos of your electrical or plumbing work.';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newItem: WorkEvidence = {
        id: 'ev-' + Date.now(),
        workerId: 'worker-demo',
        title: file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Work Evidence Photo',
        mediaUrl: dataUrl,
        thumbnailUrl: dataUrl,
        type: file.type.startsWith('video') ? 'video' : 'photo',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        location: 'Bengaluru, Karnataka (GPS Tagged)',
        verified: true,
      };

      if (isOfflineSimulated) {
        queueEvidenceOffline({
          workerId: newItem.workerId,
          title: newItem.title,
          dataUrl: newItem.mediaUrl,
          timestamp: newItem.timestamp,
          location: newItem.location,
        });
        setOfflineToast(t.screen4.offlineNotice);
      } else {
        setOfflineToast(t.screen4.syncedNotice);
      }

      setEvidenceList([newItem, ...evidenceList]);
      setTimeout(() => setOfflineToast(''), 4000);
    };
    reader.readAsDataURL(file);
    // Reset inputs so same file or retake can be uploaded again
    e.target.value = '';
  };

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('credify_worker_evidence', JSON.stringify(evidenceList));
    }
    router.push('/worker/assessment');
  };

  return (
    <PhoneFrame showBottomNav={false} backHref="/worker/skills">
      <div className="p-5 flex flex-col justify-between min-h-full space-y-4">
        
        {/* Top Header & Speaker */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-navy-primary tracking-tight">
              {t.screen4.title}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              {t.screen4.subtitle}
            </p>
          </div>
          <SpeakerButton textToRead={audioPrompt} size="md" />
        </div>

        {/* 3-Step Progress Dots (Step 3 active) */}
        <ProgressDots currentStep={3} totalSteps={3} />

        {/* Offline Queue Simulation Toggle */}
        <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <span className="text-slate-600 flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-slate-500" />
            <span>Simulate Offline Mode:</span>
          </span>
          <button
            type="button"
            onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
            className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors ${
              isOfflineSimulated ? 'bg-orange text-white' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isOfflineSimulated ? 'Offline Active' : 'Online'}
          </button>
        </div>

        {offlineToast && (
          <div className="bg-green-tint border border-green/30 text-green-dark p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
            <span>{offlineToast}</span>
          </div>
        )}

        {/* Evidence Gallery Component */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
          <EvidenceGallery items={evidenceList} showPreview={true} />
        </div>

        {/* Action Buttons: Upload (Navy) & Take Photo (Outline) - Separated camera vs media */}
        <div className="space-y-2.5">
          {/* File Picker input for media files */}
          <input
            type="file"
            accept="image/*,video/*"
            ref={uploadInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Camera input with environment capture for rear phone camera */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              variant="primary"
              size="lg"
              icon={<Upload className="w-4 h-4" />}
              className="font-bold"
            >
              {t.screen4.upload}
            </Button>

            <Button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              variant="outline"
              size="lg"
              icon={<Camera className="w-4 h-4 text-orange" />}
              className="font-bold bg-white border-2 hover:border-orange/50"
            >
              {t.screen4.takePhoto}
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleNext}
            variant="orange"
            fullWidth
            size="lg"
            className="font-bold flex items-center justify-center gap-2 mt-2 shadow-button"
          >
            <span>Proceed to Skill Check</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </PhoneFrame>
  );
}
