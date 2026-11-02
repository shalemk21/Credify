import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number; // 1-5
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 5,
  onChange,
  readOnly = false,
  size = 'md',
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  const activeVal = hoverValue !== null ? hoverValue : value;

  return (
    <div className={`flex items-center gap-1.5 select-none ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= activeVal;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={`transition-transform ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
            }`}
            aria-label={`Rate ${star} star`}
          >
            <Star
              className={`${starSizes} ${
                isFilled
                  ? 'text-orange fill-orange drop-shadow-sm'
                  : 'text-slate-300 fill-transparent'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
