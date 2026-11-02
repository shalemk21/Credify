'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { useI18n } from '@/lib/i18n';

interface SpeakerButtonProps {
  textToRead: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  textToRead,
  size = 'md',
  className = '',
  ariaLabel = 'Read aloud in your language',
}) => {
  const { locale } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-11 h-11 p-2.5',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        textToRead,
        locale,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={ariaLabel}
      title={isPlaying ? "Stop audio" : "Listen in your language"}
      className={`rounded-full flex items-center justify-center transition-all ${
        isPlaying
          ? 'bg-orange text-white ring-4 ring-orange/20 animate-pulse'
          : 'bg-navy-primary/5 hover:bg-navy-primary/10 text-navy-primary active:scale-95'
      } ${sizeClasses} ${className}`}
    >
      {isPlaying ? (
        <VolumeX className={iconSizes} />
      ) : (
        <Volume2 className={iconSizes} />
      )}
    </button>
  );
};
