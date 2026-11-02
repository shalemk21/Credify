import React from 'react';

interface ProgressDotsProps {
  currentStep: number; // 1, 2, or 3
  totalSteps?: number;
  className?: string;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  currentStep = 1,
  totalSteps = 3,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 py-2 select-none ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-navy-primary text-white shadow-sm ring-4 ring-navy-primary/15 scale-105'
                  : isCompleted
                  ? 'bg-green text-white'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? '✓' : stepNum}
            </div>
            {i < totalSteps - 1 && (
              <div
                className={`w-6 h-0.5 rounded-full transition-colors ${
                  stepNum < currentStep ? 'bg-green' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
