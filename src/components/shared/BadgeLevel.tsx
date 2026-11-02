import React from 'react';
import { BadgeLevel as LevelType } from '@/types';
import { Award, ShieldCheck } from 'lucide-react';

interface BadgeLevelProps {
  level: LevelType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const BadgeLevel: React.FC<BadgeLevelProps> = ({
  level,
  size = 'sm',
  showIcon = true,
  className = '',
}) => {
  const styles = {
    Gold: {
      bg: 'bg-[#FEF6E7] text-[#B45309] border border-[#FCD34D]',
      iconColor: 'text-[#F5A623]',
      label: 'Gold',
    },
    Silver: {
      bg: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]',
      iconColor: 'text-[#8A94A6]',
      label: 'Silver',
    },
    Bronze: {
      bg: 'bg-[#FDF4EE] text-[#9A3412] border border-[#FED7AA]',
      iconColor: 'text-[#B87333]',
      label: 'Bronze',
    },
  }[level] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    iconColor: 'text-slate-500',
    label: level,
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-bold rounded-full',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold rounded-full',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-extrabold rounded-full',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span className={`inline-flex items-center ${styles.bg} ${sizeStyles} ${className} select-none shadow-sm`}>
      {showIcon && (
        <Award className={`${iconSizes} ${styles.iconColor} fill-current stroke-[1.5]`} />
      )}
      <span>{styles.label}</span>
    </span>
  );
};
