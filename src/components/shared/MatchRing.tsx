import React from 'react';

interface MatchRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const MatchRing: React.FC<MatchRingProps> = ({
  score,
  size = 68,
  strokeWidth = 4.5,
  className = '',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  // Visual matching image: bright green circle
  const strokeColor = '#2E9E5B';

  return (
    <div
      className={`relative flex flex-col items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8F6EE"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
        <span className="text-[15px] font-black text-navy-primary tracking-tight">
          {Math.round(score)}%
        </span>
        <span className="text-[10px] font-medium text-content-secondary mt-0.5">
          Match
        </span>
      </div>
    </div>
  );
};
