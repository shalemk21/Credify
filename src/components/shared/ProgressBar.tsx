import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  color?: 'green' | 'navy' | 'orange';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  color = 'green',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const barColor = {
    green: 'bg-green',
    navy: 'bg-[#183F7D]',
    orange: 'bg-orange',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-navy-primary">
        <span>{label}</span>
        <span className="font-extrabold text-navy-primary">{Math.round(clamped)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
