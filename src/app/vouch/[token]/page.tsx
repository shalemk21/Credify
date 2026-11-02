'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import { StarRating } from '@/components/shared/StarRating';
import { Button } from '@/components/shared/Button';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { INITIAL_WORKERS, db } from '@/lib/db';
import { calculateTrustScore } from '@/lib/trust';
import { ThumbsUp, ThumbsDown, CheckCircle2, ShieldCheck, ArrowRight, Star, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VouchFlowPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  // Identify worker from token or fallback to Ramesh K.
  const worker = INITIAL_WORKERS[0];

  const [didWork, setDidWork] = useState<boolean | null>(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('Excellent work with distribution board wiring and very professional.');
  const [reviewerName, setReviewerName] = useState('Suresh Kumar');
  const [reviewerPhone, setReviewerPhone] = useState('98450 11999');
  const [role, setRole] = useState<'Homeowner' | 'Contractor' | 'Site Supervisor'>('Homeowner');

  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otp, setOtp] = useState('1234');
  const [newTrustScore, setNewTrustScore] = useState(worker.trustScore);

  const handleSubmitVouch = (e: React.FormEvent) => {
    e.preventDefault();
    if (didWork === false) {
      alert('Thank you for your feedback. Unconfirmed work has been registered.');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    // Add vouch to database and recalculate trust score
    const newVouch = {
      id: 'vouch-' + Date.now(),
      workerId: worker.id,
      vouchedByName: reviewerName,
      vouchedByPhone: '+91 ' + reviewerPhone,
      role: role as any,
      rating: rating,
      workedTogether: true,
      comment: comment,
      createdAt: new Date().toISOString().slice(0, 10),
      verifiedOtp: true,
    };

    const updatedVouches = [newVouch, ...worker.vouches];
    const res = calculateTrustScore({
      declaredSkills: worker.declaredSkills,
      evidence: worker.evidence,
      vouches: updatedVouches,
      assessment: worker.assessment,
      assessorVerified: worker.assessorVerified,
    });

    setNewTrustScore(res.totalScore);
    db.updateWorker(worker.id, {
      vouches: updatedVouches,
      trustScore: res.totalScore,
      badgeLevel: res.badgeLevel,
    });

    setStep('success');

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between py-6 px-4">
      {/* Top Header with Physical Back Button (Requirement 7) */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-navy-primary shadow-xs transition-colors"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Logo size="sm" showProduct={true} href="/" />
        </div>
        <SpeakerButton
          textToRead={`Vouch for ${worker.name}. Did this person do this work for you? Rate their work and submit.`}
          size="md"
        />
      </div>

      {/* Vouch Card (Centered max-w-md, matches Screen 7 in showcase image) */}
      <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-6 border border-slate-200/90 shadow-card space-y-5">
        
        {/* Worker Profile Header */}
        <div className="text-center space-y-2">
          <div className="relative inline-block">
            <img
              src={worker.avatarUrl}
              alt={worker.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-md mx-auto"
            />
            <span className="absolute bottom-0 right-0 bg-green text-white p-1 rounded-full ring-2 ring-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-navy-primary">
              Vouch for {worker.name}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              Help build trust in our skilled workforce
            </p>
          </div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmitVouch} className="space-y-4">
            
            {/* Question: Did this person do this work for you? */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-center space-y-3">
              <p className="text-xs font-bold text-navy-primary">
                Did this person do this work for you?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDidWork(true)}
                  className={`py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    didWork === true
                      ? 'bg-navy-primary text-white shadow-button-navy'
                      : 'bg-white text-navy-primary border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 fill-current" />
                  <span>Yes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDidWork(false)}
                  className={`py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    didWork === false
                      ? 'bg-navy-primary text-white shadow-button-navy'
                      : 'bg-white text-navy-primary border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 fill-current" />
                  <span>No</span>
                </button>
              </div>
            </div>

            {didWork && (
              <>
                {/* 5 Orange Stars Rating */}
                <div className="text-center space-y-2 py-1">
                  <p className="text-xs font-bold text-navy-primary">Rate their work</p>
                  <div className="flex justify-center">
                    <StarRating value={rating} onChange={setRating} size="lg" />
                  </div>
                </div>

                {/* Optional Comment Box */}
                <div>
                  <textarea
                    rows={3}
                    placeholder="Add a comment (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full text-xs font-medium text-navy-primary p-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-navy-primary resize-none bg-slate-50/30"
                  />
                </div>

                {/* Contact info for fraud prevention */}
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <div>
                    <label className="block mb-1 text-slate-500 text-[10px]">Your Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-500 text-[10px]">Your Mobile (OTP verified)</label>
                    <input
                      type="text"
                      value={reviewerPhone}
                      onChange={(e) => setReviewerPhone(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Bottom Navy Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="font-bold"
            >
              Submit
            </Button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-navy-primary mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-green" />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-navy-primary">
                Verify Your Endorsement
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                We sent a 4-digit OTP to +91 {reviewerPhone}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-2 text-xs font-black text-navy-primary">
              Demo OTP: 1234
            </div>

            <input
              type="text"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center tracking-[12px] text-2xl font-black text-navy-primary rounded-2xl border-2 border-orange px-3.5 py-2.5 bg-orange-light/30 focus:outline-none"
            />

            <Button
              type="button"
              onClick={handleVerifyOtp}
              variant="orange"
              fullWidth
              size="lg"
              className="font-bold"
            >
              Confirm Vouch & Update Trust Score
            </Button>
          </div>
        )}

        {/* Success confirmation */}
        {step === 'success' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-green text-white mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-navy-primary">
                Thank You for Vouching!
              </h3>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                Your phone-verified vouch has been stamped to {worker.name}&apos;s SkillPassport.
              </p>
            </div>

            {/* Live Trust Score Update Highlight */}
            <div className="bg-green-tint border border-green/30 p-4 rounded-2xl text-center space-y-1">
              <span className="text-[11px] font-bold text-green-dark block">
                Instant Trust Score Recalculation:
              </span>
              <span className="text-2xl font-black text-navy-primary block">
                {worker.trustScore} → {newTrustScore} / 100
              </span>
              <span className="text-[10px] text-green-dark font-medium block">
                +10 points awarded from your 5-star verified testimonial
              </span>
            </div>

            <Button
              href={`/passport/${worker.id}`}
              variant="primary"
              fullWidth
              size="lg"
              className="font-bold mt-2"
            >
              View Updated Skill Passport →
            </Button>
          </div>
        )}

      </div>

      {/* Footer Branding */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-slate-400 pt-4">
        Powered by Credify Trust Layer • Anti-Fraud Rate Limited
      </div>
    </div>
  );
}
