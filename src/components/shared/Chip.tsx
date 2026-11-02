import React from 'react';
import { Check, X } from 'lucide-react';

interface ChipProps {
  label: string;
  variant?: 'green' | 'navy' | 'neutral' | 'orange' | 'outline';
  showCheck?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'green',
  showCheck = true,
  onRemove,
  onClick,
  selected = false,
  className = '',
  size = 'md',
}) => {
  const sizeStyles = size === 'sm' ? 'text-xs px-2.5 py-1 gap-1' : 'text-sm px-3.5 py-1.5 gap-1.5';

  const variantStyles = {
    green: 'bg-green-tint text-green-dark border border-green/30 font-medium',
    navy: 'bg-navy-primary text-white font-medium',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    orange: 'bg-orange-light text-orange font-medium border border-orange/20',
    outline: 'bg-white text-navy-primary border border-slate-300 font-medium hover:border-navy-primary',
  }[variant];

  const clickableStyles = onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-transform' : '';
  const selectedStyles = selected ? 'ring-2 ring-navy-primary font-bold' : '';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-pill ${sizeStyles} ${variantStyles} ${clickableStyles} ${selectedStyles} ${className} select-none`}
    >
      <span>{label}</span>
      {showCheck && !onRemove && (
        <Check className="w-3.5 h-3.5 stroke-[2.5] text-green-dark" />
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:bg-black/10 rounded-full p-0.5"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
    </span>
  );
};
