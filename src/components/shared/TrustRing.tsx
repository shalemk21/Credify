import React from 'react';

interface TrustRingProps {
  score: number; // 0-100
  size?: number; // width/height in px
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export const TrustRing: React.FC<TrustRingProps> = ({
  score,
  size = 90,
  strokeWidth = 6,
  label = 'Trust Score',
  className = '',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Color gradient / stroke based on score
  const strokeColor = score >= 70 ? '#2E9E5B' : score >= 40 ? '#0B2A5B' : '#F47B20';

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress arc */}
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
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-navy-primary leading-none">
            {Math.round(score)}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-bold text-content-secondary mt-1 tracking-tight">
          {label}
        </span>
      )}
    </div>
  );
};
