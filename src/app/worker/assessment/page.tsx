'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFrame } from '@/components/worker/PhoneFrame';
import { SpeakerButton } from '@/components/shared/SpeakerButton';
import { BadgeLevel } from '@/components/shared/BadgeLevel';
import { Button } from '@/components/shared/Button';
import { useI18n } from '@/lib/i18n';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Award,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Zap,
  Wrench
} from 'lucide-react';
import { Trade, BadgeLevel as LevelType } from '@/types';

interface Question {
  id: string;
  scenario: string;
  emoji: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  hint: string;
}

const ELECTRICIAN_QUESTIONS: Question[] = [
  {
    id: 'e1',
    scenario: 'A homeowner reports their main MCB trips every time the geyser and AC turn on together. What is the first correct step?',
    emoji: '⚡',
    options: [
      { id: 'o1', text: 'Check circuit load balancing and calculate ampere rating on that phase', isCorrect: true },
      { id: 'o2', text: 'Replace with a higher 63A breaker without checking wire gauge', isCorrect: false },
      { id: 'o3', text: 'Bypass the MCB with direct copper wire', isCorrect: false },
    ],
    hint: 'Never bypass safety breakers; always verify load and cable gauge.',
  },
  {
    id: 'e2',
    scenario: 'What is the required earthing resistance standard for residential installations in India (IS 3043)?',
    emoji: '🌍',
    options: [
      { id: 'o1', text: 'Less than 2 to 5 Ohms', isCorrect: true },
      { id: 'o2', text: 'Around 50 Ohms', isCorrect: false },
      { id: 'o3', text: 'Resistance does not matter as long as copper plate is buried', isCorrect: false },
    ],
    hint: 'Safe residential earth pit resistance must be strictly below 5 Ohms.',
  },
  {
    id: 'e3',
    scenario: 'Which wire color code corresponds to the Neutral wire according to Indian standard (IS 732)?',
    emoji: '🔌',
    options: [
      { id: 'o1', text: 'Black or Blue (Single Phase)', isCorrect: true },
      { id: 'o2', text: 'Green with Yellow stripe', isCorrect: false },
      { id: 'o3', text: 'Red wire', isCorrect: false },
    ],
    hint: 'Green is Earth, Red/Yellow/Blue are Phase, Black is Neutral.',
  },
  {
    id: 'e4',
    scenario: 'When installing an inverter battery bank indoors, what is crucial for battery room safety?',
    emoji: '🔋',
    options: [
      { id: 'o1', text: 'Proper cross ventilation to exhaust hydrogen gas safely', isCorrect: true },
      { id: 'o2', text: 'Sealing all windows airtight to keep dust out', isCorrect: false },
      { id: 'o3', text: 'Keeping open flames nearby to test battery warmth', isCorrect: false },
    ],
    hint: 'Lead-acid batteries emit hydrogen gas while charging.',
  },
  {
    id: 'e5',
    scenario: 'You notice frayed insulation on a 2.5 sq mm copper wire running near a water pipe. What should you do?',
    emoji: '⚠️',
    options: [
      { id: 'o1', text: 'Isolate power, replace the damaged section, and route inside PVC conduit', isCorrect: true },
      { id: 'o2', text: 'Wrap basic paper tape around it and leave it', isCorrect: false },
      { id: 'o3', text: 'Tie the wire to the metal pipe with cable ties', isCorrect: false },
    ],
    hint: 'Conduit protects electrical wires from physical abrasion and moisture.',
  },
];

const PLUMBER_QUESTIONS: Question[] = [
  {
    id: 'p1',
    scenario: 'Water is dripping from the concealed wall diverter behind shower tiles. What is the professional diagnosis?',
    emoji: '🚿',
    options: [
      { id: 'o1', text: 'Worn cartridge O-ring or ceramic disc seal requires replacement', isCorrect: true },
      { id: 'o2', text: 'The bathroom tile mortar is leaking water', isCorrect: false },
      { id: 'o3', text: 'Pour acid down the drain line', isCorrect: false },
    ],
    hint: 'Diverter cartridges control hot/cold mixing and fail first when hard water scale forms.',
  },
  {
    id: 'p2',
    scenario: 'Which solvent cement is specifically rated for hot water CPVC supply lines?',
    emoji: '🧴',
    options: [
      { id: 'o1', text: 'Yellow Heavy Duty CPVC Solvent (ASTM F493)', isCorrect: true },
      { id: 'o2', text: 'Normal Clear PVC electrical conduit glue', isCorrect: false },
      { id: 'o3', text: 'Silicone kitchen sealant only', isCorrect: false },
    ],
    hint: 'CPVC handles boiling water temperatures and requires chemical weld solvent.',
  },
  {
    id: 'p3',
    scenario: 'Overhead water tank continuously overflows even when power switch is OFF. What is the root cause?',
    emoji: '🚰',
    options: [
      { id: 'o1', text: 'Mechanical brass float valve washer is damaged or misaligned', isCorrect: true },
      { id: 'o2', text: 'The municipal water pressure is too low', isCorrect: false },
      { id: 'o3', text: 'The tank capacity is too small', isCorrect: false },
    ],
    hint: 'Float valves mechanically shut off incoming water when buoyant level is reached.',
  },
  {
    id: 'p4',
    scenario: 'What is the required slope for a residential 110mm underground soil/sewage drain pipe?',
    emoji: '📐',
    options: [
      { id: 'o1', text: '1:40 to 1:50 gravity gradient for self-cleansing velocity', isCorrect: true },
      { id: 'o2', text: 'Completely horizontal 0 degree flat', isCorrect: false },
      { id: 'o3', text: 'Slope upwards toward the municipal manhole', isCorrect: false },
    ],
    hint: 'Gravity drainage needs a 1:40 minimum fall to carry waste solids without clogging.',
  },
  {
    id: 'p5',
    scenario: 'A customer experiences water hammer (loud banging noise in pipes when tap shuts). How do you resolve it?',
    emoji: '🔨',
    options: [
      { id: 'o1', text: 'Install a water hammer arrestor or air chamber near quick-closing valves', isCorrect: true },
      { id: 'o2', text: 'Loosen all pipe clamps on the wall', isCorrect: false },
      { id: 'o3', text: 'Increase booster pump pressure to maximum', isCorrect: false },
    ],
    hint: 'Water hammer arrestors absorb the sudden kinetic shockwave.',
  },
];

const SAFETY_CHECKLIST = [
  'I always test line with calibrated voltage tester / pressure gauge before touching.',
  'I use ISI-marked rubber insulated safety gloves & shoes on all live site visits.',
  'I never bypass standard miniature circuit breakers (MCBs) or safety relief valves.',
  'I confirm earthing continuity before handing over electrical or geyser fittings.',
  'I keep a clean site and safe disposal of stripped insulation and solvent wastes.',
];

export default function SkillAssessmentPage() {
  const router = useRouter();
  const { locale } = useI18n();

  const [trade] = useState<Trade>('ELECTRICIAN');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState<number[]>([0, 1, 2, 3, 4]);

  const questions = trade === 'ELECTRICIAN' ? ELECTRICIAN_QUESTIONS : PLUMBER_QUESTIONS;
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optionId: string) => {
    setAnswers({ ...answers, [currentQIndex]: optionId });
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate score and level
      finishAssessment();
    }
  };

  const finishAssessment = () => {
    setIsCompleted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  // Compute results
  let correctCount = 0;
  questions.forEach((q, idx) => {
    const chosen = answers[idx];
    const correctOpt = q.options.find((o) => o.isCorrect)?.id;
    if (chosen === correctOpt) correctCount++;
  });

  const score = Math.round((correctCount / questions.length) * 30);
  const level: LevelType = score >= 24 ? 'Gold' : score >= 14 ? 'Silver' : 'Bronze';

  const audioIntro = locale === 'hi'
    ? 'स्किल चेक। अपनी दक्षता साबित करने के लिए ५ सवालों के जवाब दें।'
    : locale === 'kn'
    ? 'ಕೌಶಲ್ಯ ಪರಿಶೀಲನೆ. ನಿಮ್ಮ ಅನುಭವ ಸಾಬೀತುಪಡಿಸಲು ೫ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.'
    : 'Skill Check. Answer 5 practical scenario questions to prove your mastery.';

  return (
    <PhoneFrame showBottomNav={false} backHref="/worker/evidence">
      <div className="p-5 flex flex-col justify-between min-h-full space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-navy-primary tracking-tight">
              Skill Check
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              Practical on-ground trade scenarios (No pen & paper)
            </p>
          </div>
          <SpeakerButton textToRead={audioIntro} size="md" />
        </div>

        {!isCompleted ? (
          /* Active Question Flow */
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-navy-primary">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
              <span className="text-orange">{Math.round(((currentQIndex + 1) / questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-navy-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Scenario Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs">
                  {currentQ.emoji}
                </span>
                <span className="text-xs font-bold text-orange uppercase tracking-wider">
                  Scenario {currentQIndex + 1}
                </span>
              </div>
              <p className="text-sm font-extrabold text-navy-primary leading-relaxed">
                {currentQ.scenario}
              </p>
            </div>

            {/* Answer Options (Big buttons as requested in spec) */}
            <div className="space-y-2.5">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQIndex] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-2xl text-left text-xs font-bold transition-all min-h-[56px] flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-navy-primary text-white shadow-button-navy ring-2 ring-navy-primary'
                        : 'bg-white text-navy-primary border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="leading-relaxed">{option.text}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-orange shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Button */}
            <div className="pt-2">
              <Button
                type="button"
                disabled={!answers[currentQIndex]}
                onClick={handleNextQuestion}
                variant="orange"
                fullWidth
                size="lg"
                className="font-bold"
              >
                {currentQIndex === questions.length - 1 ? 'Complete Skill Check' : 'Next Scenario →'}
              </Button>
            </div>
          </div>
        ) : (
          /* Results Screen: Badge + Safety Awareness */
          <div className="space-y-4 py-2 animate-in zoom-in-95">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-light text-orange mx-auto flex items-center justify-center shadow-button">
                <Award className="w-10 h-10 stroke-[2]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-navy-primary">
                  Assessment Completed!
                </h2>
                <p className="text-xs text-content-secondary mt-1">
                  You scored {score} / 30 on real-world diagnostics
                </p>
              </div>

              {/* Badge Pill */}
              <div className="py-2 flex justify-center">
                <BadgeLevel level={level} size="lg" />
              </div>

              {/* What's Missing Card (Section 6 spec) */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
                <p className="font-bold text-navy-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange" />
                  <span>Growth recommendation:</span>
                </p>
                <p className="text-content-secondary">
                  Master &quot;Pure Sinewave Inverter Diagnostics&quot; to unlock NSQF Level 5 and increase daily wage by 25%.
                </p>
              </div>
            </div>

            {/* Safety Checklist Section (Section 10 spec: adds Safety Aware Badge) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green" />
                <h3 className="text-xs font-black text-navy-primary">
                  Safety Aware Protocol (Mandatory)
                </h3>
              </div>

              <div className="space-y-2 text-[11px] font-semibold text-slate-700">
                {SAFETY_CHECKLIST.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyChecked.includes(idx)}
                      onChange={() => {
                        setSafetyChecked((prev) =>
                          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                        );
                      }}
                      className="mt-0.5 rounded text-green focus:ring-green"
                    />
                    <span className="leading-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <Button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('credify_worker_badge', level);
                    localStorage.setItem('credify_worker_safety', 'true');
                  }
                  router.push('/worker/passport');
                }}
                variant="orange"
                fullWidth
                size="lg"
                className="font-bold"
              >
                Generate My Skill Passport →
              </Button>

              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setCurrentQIndex(0);
                  setIsCompleted(false);
                }}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-navy-primary py-2 flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Assessment</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </PhoneFrame>
  );
}
