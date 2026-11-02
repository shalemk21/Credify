'use client';

import React, { useState } from 'react';
import { WorkEvidence } from '@/types';
import { CheckCircle2, ShieldCheck, MapPin, Calendar } from 'lucide-react';

interface EvidenceGalleryProps {
  items: WorkEvidence[];
  showPreview?: boolean;
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  items,
  showPreview = true,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!items || items.length === 0) {
    return (
      <div className={`p-6 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl ${className}`}>
        <p className="text-sm text-content-secondary font-medium">No work evidence uploaded yet.</p>
      </div>
    );
  }

  const activeItem = items[selectedIndex] || items[0];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Large Featured Preview (matches Screen 4 in showcase) */}
      {showPreview && activeItem && (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/3] group shadow-sm">
          <img
            src={activeItem.mediaUrl}
            alt={activeItem.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top overlay details */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-3 text-white">
            <h4 className="text-xs font-bold truncate leading-tight drop-shadow-sm">
              {activeItem.title}
            </h4>
            <div className="flex items-center gap-3 text-[10px] text-slate-200 mt-1">
              {activeItem.location && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-orange" />
                  {activeItem.location}
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Calendar className="w-3 h-3 text-slate-300" />
                {activeItem.timestamp.slice(0, 10)}
              </span>
            </div>
          </div>

          {/* Verified green tick badge (as shown in Screen 4) */}
          {activeItem.verified && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-green/30">
              <CheckCircle2 className="w-4 h-4 text-green fill-green-tint" />
              <span className="text-[11px] font-bold text-green-dark">Verified Evidence</span>
            </div>
          )}
        </div>
      )}

      {/* Thumbnail Strip (matches bottom strip in Screen 4) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
        {items.map((item, idx) => (
          <button
            key={item.id || idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
              idx === selectedIndex
                ? 'border-navy-primary ring-2 ring-navy-primary/20 scale-105 shadow-md'
                : 'border-slate-200 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={item.thumbnailUrl || item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.verified && (
              <span className="absolute bottom-1 right-1 bg-green text-white p-0.5 rounded-full shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
