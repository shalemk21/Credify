'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { ProgressDots } from '@/components/shared/ProgressDots';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import { createSpeechRecognizer, extractDigitsFromSpeech } from '@/lib/speech';
import {
  ShieldCheck,
  Check,
  Sparkles,
  Smartphone,
  Mic,
  MicOff,
  Camera,
  RefreshCw,
  X,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function WorkerVerifyPage() {
  const router = useRouter();
  const { t, locale } = useI18n();

  const [phone, setPhone] = useState('98765 43210');
  const [name, setName] = useState('Ramesh Kumar');
  const [trade, setTrade] = useState<'ELECTRICIAN' | 'PLUMBER'>('ELECTRICIAN');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Speech Recognition state
  const [activeMicField, setActiveMicField] = useState<'phone' | 'name' | null>(null);
  const [speechError, setSpeechError] = useState('');
  const recognizerRef = useRef<any>(null);

  // Camera / Selfie state
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const audioText = locale === 'hi'
    ? 'अपना मोबाइल नंबर दर्ज करें और ओटीपी सत्यापित करें। डेमो ओटीपी १२३४ है।'
    : locale === 'kn'
    ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ. ಡೆಮೊ ಒಟಿಪಿ ೧೨೩೪.'
    : 'Enter your phone number and verify with OTP. Demo OTP is 1234.';

  // Initialize saved values from localStorage
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem('credify_worker_phone');
      if (savedPhone) setPhone(savedPhone);
      const savedName = localStorage.getItem('credify_worker_name');
      if (savedName) setName(savedName);
      const savedPhoto = localStorage.getItem('credify_worker_selfie');
      if (savedPhoto) setSelfiePhoto(savedPhoto);
    } catch {}
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
      if (recognizerRef.current) {
        try { recognizerRef.current.abort(); } catch {}
      }
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Handle Speech Recognition for Phone or Name
  const toggleSpeechRecognition = (field: 'phone' | 'name') => {
    setSpeechError('');

    if (activeMicField === field) {
      // Stop active recognition
      if (recognizerRef.current) {
        try { recognizerRef.current.stop(); } catch {}
      }
      setActiveMicField(null);
      return;
    }

    if (recognizerRef.current) {
      try { recognizerRef.current.abort(); } catch {}
    }

    const recognizer = createSpeechRecognizer(
      locale,
      (transcript) => {
        if (field === 'phone') {
          const digits = extractDigitsFromSpeech(transcript);
          if (digits) {
            // Format nicely if 10 digits
            if (digits.length <= 10) {
              setPhone(digits.replace(/(\d{5})(\d{1,5})/, '$1 $2').trim());
            } else {
              setPhone(digits.slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2'));
            }
          }
        } else {
          // For name, clean text capitalization
          const formatted = transcript
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          setName(formatted);
        }
      },
      (error) => {
        setSpeechError(typeof error === 'string' ? error : 'Voice input unavailable');
        setActiveMicField(null);
      },
      () => {
        setActiveMicField(null);
      }
    );

    if (!recognizer) {
      setSpeechError('Speech recognition is not supported in this browser. Please type directly.');
      return;
    }

    recognizerRef.current = recognizer;
    setActiveMicField(field);
    try {
      recognizer.start();
    } catch (e) {
      setSpeechError('Could not start microphone. Check microphone permissions.');
      setActiveMicField(null);
    }
  };

  // Camera handling
  const handleStartCamera = async () => {
    setCameraError('');
    setIsCameraModalOpen(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        // Fallback to native mobile file input capture
        setIsCameraModalOpen(false);
        hiddenFileInputRef.current?.click();
      }
    } catch (err: any) {
      console.warn('Direct webcam access failed, falling back to file capture:', err);
      setIsCameraModalOpen(false);
      // Trigger native camera capture input
      hiddenFileInputRef.current?.click();
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror horizontally for selfie camera feel
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelfiePhoto(dataUrl);
        try {
          localStorage.setItem('credify_worker_selfie', dataUrl);
        } catch {}
      }
    } catch (err) {
      console.error('Error snapping photo:', err);
    } finally {
      stopCameraStream();
      setIsCameraModalOpen(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelfiePhoto(dataUrl);
      try {
        localStorage.setItem('credify_worker_selfie', dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp('1234'); // Pre-fill demo OTP
  };

  const handleVerify = () => {
    if (otp !== '1234') {
      setOtpError('Invalid OTP. Use Demo OTP: 1234');
      return;
    }
    // Save state in localStorage for the active session
    if (typeof window !== 'undefined') {
      localStorage.setItem('credify_worker_phone', phone);
      localStorage.setItem('credify_worker_name', name);
      localStorage.setItem('credify_worker_trade', trade);
    }
    router.push('/worker/skills');
  };

  return (
    <PhoneFrame showBottomNav={false} backHref="/worker/onboarding">
      <div className="p-5 flex flex-col justify-between min-h-full space-y-5">
        
        {/* Top Header & Speaker */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-navy-primary tracking-tight">
              {t.screen2.title}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              {t.screen2.subtitle}
            </p>
          </div>
          <SpeakerButton textToRead={audioText} size="md" />
        </div>

        {/* 3-Step Progress Dots (Step 1 active) */}
        <ProgressDots currentStep={1} totalSteps={3} />

        {/* Center Illustration: Smartphone with Green Shield */}
        <div className="flex justify-center my-1">
          <div className="w-36 h-28 relative flex items-center justify-center">
            <svg viewBox="0 0 200 160" fill="none" className="w-36 h-28 drop-shadow-sm">
              <path d="M40 130 C30 100 50 70 60 60 C70 85 65 115 40 130 Z" fill="#2E9E5B" opacity="0.3" />
              <path d="M160 130 C170 100 150 70 140 60 C130 85 135 115 160 130 Z" fill="#2E9E5B" opacity="0.3" />
              <rect x="68" y="10" width="64" height="120" rx="14" fill="#0B2A5B" />
              <rect x="72" y="17" width="56" height="106" rx="10" fill="#FFFFFF" />
              <circle cx="100" cy="14" r="2" fill="#64748B" />
              <path
                d="M100 42 L118 52 V75 C118 90 110 100 100 105 C90 100 82 90 82 75 V52 L100 42 Z"
                fill="#E8F6EE"
                stroke="#2E9E5B"
                strokeWidth="3.5"
              />
              <path
                d="M93 72 L98 77 L108 66"
                stroke="#2E9E5B"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Speech Error Banner if any */}
        {speechError && (
          <div className="bg-orange-light/40 border border-orange/40 text-navy-primary p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Input Fields Card */}
        <div className="bg-white rounded-3xl p-5 shadow-card border border-slate-100 space-y-4">
          
          {/* Phone Number Input with Tap-to-Speak Mic Button (Requirement 2) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-navy-primary">
                {t.screen2.phoneLabel}
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Tap mic to speak number
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 focus-within:border-navy-primary bg-slate-50/50 transition-colors">
                <span className="text-sm font-black text-navy-primary mr-2">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.screen2.phonePlaceholder}
                  className="w-full text-base font-extrabold text-navy-primary bg-transparent focus:outline-none"
                />
              </div>

              {/* Tap to Speak Microphone Button */}
              <button
                type="button"
                onClick={() => toggleSpeechRecognition('phone')}
                title={activeMicField === 'phone' ? 'Stop listening' : 'Speak your phone number'}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                  activeMicField === 'phone'
                    ? 'bg-orange text-white ring-4 ring-orange/30 animate-pulse scale-105'
                    : 'bg-navy-primary/5 hover:bg-navy-primary/10 text-navy-primary border border-navy-primary/10'
                }`}
              >
                {activeMicField === 'phone' ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-navy-primary" />
                )}
              </button>
            </div>

            {activeMicField === 'phone' && (
              <p className="text-[11px] text-orange font-bold mt-1.5 animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange"></span>
                <span>Listening... Speak digits (e.g. &quot;9876543210&quot;)</span>
              </p>
            )}
          </div>

          {/* Trade Selection for Demo */}
          <div>
            <label className="block text-xs font-bold text-navy-primary mb-1.5">
              Your Primary Trade
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTrade('ELECTRICIAN')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border-2 transition-all ${
                  trade === 'ELECTRICIAN'
                    ? 'border-navy-primary bg-navy-primary text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                ⚡ Electrician
              </button>
              <button
                type="button"
                onClick={() => setTrade('PLUMBER')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border-2 transition-all ${
                  trade === 'PLUMBER'
                    ? 'border-navy-primary bg-navy-primary text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                🔧 Plumber
              </button>
            </div>
          </div>

          {/* Name Input with Tap-to-Speak Mic Button (Requirement 2) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-navy-primary">
                {t.screen2.nameLabel}
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Tap mic to speak name
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.screen2.namePlaceholder}
                className="flex-1 text-sm font-bold text-navy-primary rounded-2xl border-2 border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-navy-primary bg-slate-50/50"
              />

              <button
                type="button"
                onClick={() => toggleSpeechRecognition('name')}
                title={activeMicField === 'name' ? 'Stop listening' : 'Speak your name'}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                  activeMicField === 'name'
                    ? 'bg-orange text-white ring-4 ring-orange/30 animate-pulse scale-105'
                    : 'bg-navy-primary/5 hover:bg-navy-primary/10 text-navy-primary border border-navy-primary/10'
                }`}
              >
                {activeMicField === 'name' ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-navy-primary" />
                )}
              </button>
            </div>

            {activeMicField === 'name' && (
              <p className="text-[11px] text-orange font-bold mt-1.5 animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange"></span>
                <span>Listening... Speak your full name</span>
              </p>
            )}
          </div>

          {/* Selfie / Photo Verification Card (Requirement 3) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-navy-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green" />
                <span>Worker Selfie Verification (Optional)</span>
              </label>
              <span className="text-[10px] font-bold text-green bg-green-tint px-2 py-0.5 rounded-full">
                Face Match
              </span>
            </div>

            {/* Hidden fallback camera input */}
            <input
              type="file"
              accept="image/*"
              capture="user"
              ref={hiddenFileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {selfiePhoto ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-green-tint/50 border border-green/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selfiePhoto}
                      alt="Selfie preview"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                    />
                    <CheckCircle2 className="w-4 h-4 text-green bg-white rounded-full absolute -bottom-1 -right-1" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-dark">Selfie Stamped</p>
                    <p className="text-[10px] text-green-dark/80">Ready for SkillPassport badge</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="px-3 py-1.5 rounded-xl bg-white text-navy-primary border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Retake</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-navy-primary/5 text-navy-primary flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-primary">Add Verified Photo</p>
                    <p className="text-[10px] text-slate-400">Takes 5 seconds</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="px-3.5 py-2 rounded-xl bg-navy-primary hover:bg-navy-deep text-white text-xs font-bold transition-all shadow-button flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-orange" />
                  <span>Use Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* OTP Section */}
          {!otpSent ? (
            <Button
              type="button"
              onClick={handleSendOtp}
              variant="primary"
              fullWidth
              size="lg"
              className="mt-2 font-bold"
            >
              {t.screen2.sendOtp}
            </Button>
          ) : (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy-primary mb-1.5">
                  {t.screen2.enterOtp}
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[12px] text-2xl font-black text-navy-primary rounded-2xl border-2 border-orange px-3.5 py-2.5 bg-orange-light/30 focus:outline-none"
                />
                {otpError && (
                  <p className="text-xs text-red-500 font-bold mt-1 text-center">{otpError}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                variant="orange"
                fullWidth
                size="lg"
                className="font-bold"
              >
                {t.screen2.verifyAndContinue}
              </Button>
            </div>
          )}

          {/* Demo OTP Helper Card */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2.5 text-center">
            <span className="text-xs font-black text-navy-primary">
              {t.screen2.demoOtpHelper}
            </span>
          </div>

        </div>

      </div>

      {/* Live Device Camera Modal (Requirement 3) */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-navy-deep rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            <div className="p-4 flex items-center justify-between text-white border-b border-white/10">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange" />
                <h3 className="text-sm font-bold">Worker Selfie Capture</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setIsCameraModalOpen(false);
                }}
                className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-black aspect-square flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              {/* Selfie Frame Guide Overlay */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-full m-8 pointer-events-none flex items-center justify-center">
                <span className="text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full font-semibold">
                  Align face in circle
                </span>
              </div>
            </div>

            <div className="p-5 flex items-center justify-around bg-navy-primary border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setIsCameraModalOpen(false);
                  hiddenFileInputRef.current?.click();
                }}
                className="text-xs text-slate-300 hover:text-white underline font-semibold"
              >
                Upload from Files
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="w-16 h-16 rounded-full bg-white border-4 border-orange flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                title="Snap Photo"
              >
                <div className="w-12 h-12 rounded-full bg-orange"></div>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setIsCameraModalOpen(false);
                }}
                className="text-xs text-slate-300 hover:text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </PhoneFrame>
  );
}
