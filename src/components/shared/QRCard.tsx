'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCardProps {
  url: string;
  size?: number;
  label?: string;
  className?: string;
}

export const QRCard: React.FC<QRCardProps> = ({
  url,
  size = 110,
  label,
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#0B2A5B', // Primary navy for QR pattern
        light: '#FFFFFF',
      },
    })
      .then((res) => setDataUrl(res))
      .catch((err) => console.error('QR code generation error:', err));
  }, [url, size]);

  return (
    <div className={`flex flex-col items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="Public Passport QR Code"
          width={size}
          height={size}
          className="rounded-lg object-contain"
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className="bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-medium"
        >
          Generating QR...
        </div>
      )}
      {label && (
        <span className="text-[10px] font-bold text-navy-primary mt-1 text-center">
          {label}
        </span>
      )}
    </div>
  );
};
