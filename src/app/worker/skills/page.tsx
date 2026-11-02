'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { ProgressDots } from '@/components/shared/ProgressDots';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Chip } from '@/components/shared/Chip';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { extractSkills } from '@/lib/ai';
import { createSpeechRecognizer } from '@/lib/speech';
import { Mic, MicOff, Plus, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { Trade } from '@/types';

export default function VoiceSkillCapturePage() {
  const router = useRouter();
  const { t, locale } = useI18n();

  const [trade, setTrade] = useState<Trade>('ELECTRICIAN');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(
    'I fix house wiring, fans and inverters for 8 years.'
  );
  const [detectedSkills, setDetectedSkills] = useState<string[]>([
    'Wiring',
    'Fans',
    'Inverters',
  ]);
  const [recognizer, setRecognizer] = useState<any>(null);

  // Available skill pool for the trade to tap-to-add
  const tradeSkillGrid: Record<Trade, string[]> = {
    ELECTRICIAN: [
      'Wiring',
      'Fans',
      'Inverters',
      'MCB Installation',
      'Earthing',
      'Lighting',
      'Solar Wiring',
      'Motor Pump',
      'Conduit Piping',
    ],
    PLUMBER: [
      'Pipe Fitting',
      'Leakage Repair',
      'Sanitary Ware',
      'Geyser Installation',
      'Taps & Mixers',
      'Water Tank',
      'Drainage Lines',
      'Booster Pump',
    ],
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTrade = (localStorage.getItem('credify_worker_trade') as Trade) || 'ELECTRICIAN';
      setTrade(savedTrade);

      // Default sample sentence based on locale & trade
      if (savedTrade === 'PLUMBER') {
        setTranscript('I install bathroom pipes, geysers and fix leakages for 5 years.');
        setDetectedSkills(['Pipe Fitting', 'Geyser', 'Leakage Repair']);
      } else if (locale === 'hi') {
        setTranscript('मैं ८ साल से घरों की वायरिंग, पंखे और इन्वर्टर ठीक करता हूँ।');
      } else if (locale === 'kn') {
        setTranscript('ನಾನು ೮ ವರ್ಷಗಳಿಂದ ಮನೆ ವೈರಿಂಗ್, ಫ್ಯಾನ್ ಮತ್ತು ಇನ್ವರ್ಟರ್ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇನೆ.');
      }
    }
  }, [locale]);

  // Audio prompt for voice screen
  const audioPrompt = locale === 'hi'
    ? 'बताएं आप क्या काम करते हैं। माइक दबाएं और बोलें, या नीचे लिखें।'
    : locale === 'kn'
    ? 'ನಿಮ್ಮ ಕೆಲಸದ ವಿವರ ತಿಳಿಸಿ. ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ.'
    : 'Tell us what you do. Tap the microphone to speak, or type below.';

  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognizer) recognizer.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const rec = createSpeechRecognizer(
        locale,
        async (newText) => {
          setTranscript(newText);
          const res = await extractSkills(newText);
          if (res.detectedSkills.length > 0) {
            setDetectedSkills(res.detectedSkills);
          }
        },
        (err) => {
          console.warn('Speech error, fallback active:', err);
          setIsRecording(false);
        },
        () => setIsRecording(false)
      );

      if (rec) {
        setRecognizer(rec);
        try {
          rec.start();
        } catch {
          setIsRecording(false);
        }
      } else {
        // Fallback simulated speech for browsers without speech API
        setTimeout(async () => {
          const sample =
            locale === 'hi'
              ? 'मैं घरों की वायरिंग, पंखे और इन्वर्टर ठीक करता हूँ।'
              : locale === 'kn'
              ? 'ನಾನು ಮನೆ ವೈರಿಂಗ್, ಫ್ಯಾನ್ ಮತ್ತು ಇನ್ವರ್ಟರ್ ಕೆಲಸ ಮಾಡುತ್ತೇನೆ.'
              : 'I fix house wiring, fans and inverters for 8 years.';
          setTranscript(sample);
          const res = await extractSkills(sample);
          setDetectedSkills(res.detectedSkills);
          setIsRecording(false);
        }, 1500);
      }
    }
  };

  const removeSkill = (skill: string) => {
    setDetectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const addSkill = (skill: string) => {
    if (!detectedSkills.includes(skill)) {
      setDetectedSkills((prev) => [...prev, skill]);
    }
  };

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('credify_worker_skills', JSON.stringify(detectedSkills));
      localStorage.setItem('credify_worker_transcript', transcript);
    }
    router.push('/worker/evidence');
  };

  return (
    <PhoneFrame showBottomNav={false} backHref="/worker/verify">
      <div className="p-5 flex flex-col justify-between min-h-full space-y-5">
        
        {/* Top Header & Speaker */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-navy-primary tracking-tight">
              {t.screen3.title}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              {t.screen3.subtitle}
            </p>
          </div>
          <SpeakerButton textToRead={audioPrompt} size="md" />
        </div>

        {/* 3-Step Progress Dots (Step 2 active) */}
        <ProgressDots currentStep={2} totalSteps={3} />

        {/* Big Circular Navy Mic Button (Matches Phone 3 in Showcase) */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-button-navy ${
              isRecording
                ? 'bg-orange ring-8 ring-orange/30 animate-pulse'
                : 'bg-navy-primary hover:bg-navy-light active:scale-95'
            }`}
            aria-label="Toggle Voice Input"
          >
            {isRecording ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white stroke-[2.2]" />
            )}
          </button>

          <div className="text-center">
            <p className="text-sm font-black text-navy-primary">
              {isRecording ? t.screen3.listening : t.screen3.tapToSpeak}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              {t.screen3.orType}
            </p>
          </div>
        </div>

        {/* Speech Transcript Box (Matches Phone 3 in Showcase) */}
        <div className="relative bg-white rounded-2xl p-4 border border-slate-200 shadow-sm focus-within:border-navy-primary">
          <textarea
            rows={2}
            value={transcript}
            onChange={async (e) => {
              setTranscript(e.target.value);
              const res = await extractSkills(e.target.value);
              if (res.detectedSkills.length > 0) {
                setDetectedSkills(res.detectedSkills);
              }
            }}
            placeholder={t.screen3.transcriptPlaceholder}
            className="w-full text-sm font-medium text-navy-primary bg-transparent focus:outline-none resize-none leading-relaxed pr-8"
          />
          <div className="absolute right-3 bottom-3">
            <SpeakerButton textToRead={transcript} size="sm" />
          </div>
        </div>

        {/* Detected Skills Section (Matches Phone 3 in Showcase) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-navy-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange" />
              {t.screen3.detectedSkills}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {detectedSkills.length} skills recognized
            </span>
          </div>

          {/* Green Chips with Ticks */}
          <div className="flex flex-wrap gap-2">
            {detectedSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                variant="green"
                showCheck={true}
                onRemove={() => removeSkill(skill)}
              />
            ))}
          </div>

          {/* Quick Tap-to-Add Grid */}
          <div className="pt-2 border-t border-slate-200/60">
            <p className="text-[10px] text-slate-500 font-bold mb-1.5">
              + Tap to add other {trade.toLowerCase()} skills:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tradeSkillGrid[trade]
                .filter((s) => !detectedSkills.includes(s))
                .slice(0, 5)
                .map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="text-[11px] font-semibold bg-white hover:bg-slate-100 text-navy-primary border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-orange" />
                    <span>{skill}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Bottom Navy Next Button (Matches Phone 3 in Showcase) */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={handleNext}
            variant="primary"
            fullWidth
            size="lg"
            className="font-bold flex items-center justify-center gap-2"
          >
            <span>{t.screen3.next}</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </PhoneFrame>
  );
}
