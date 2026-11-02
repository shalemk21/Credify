import React from 'react';
import Link from 'next/link';

interface LogoProps {
  showProduct?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // dark navy background or light background
  href?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  showProduct = true,
  size = 'md',
  variant = 'light',
  href = '/',
  className = '',
}) => {
  const isDark = variant === 'dark';

  const sizeClasses = {
    sm: {
      brand: 'text-lg',
      product: 'text-sm',
      icon: 'w-6 h-6',
    },
    md: {
      brand: 'text-2xl',
      product: 'text-lg',
      icon: 'w-8 h-8',
    },
    lg: {
      brand: 'text-3xl',
      product: 'text-2xl',
      icon: 'w-10 h-10',
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Brand Icon: Stylized C with orange swoosh */}
      <div className={`relative flex items-center justify-center font-black ${sizeClasses.icon}`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="20" cy="20" r="19" stroke={isDark ? "#ffffff" : "#0B2A5B"} strokeWidth="2.5" strokeDasharray="90 30" />
          <path
            d="M26 12C20 10 12 14 12 21C12 28 20 31 27 28"
            stroke={isDark ? "#ffffff" : "#0B2A5B"}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Orange swoosh dynamic accent */}
          <path
            d="M10 25C15 28 24 29 29 20"
            stroke="#F47B20"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="28" cy="18" r="2.5" fill="#F47B20" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5 font-black tracking-tight">
          <span className={`${sizeClasses.brand} ${isDark ? 'text-white' : 'text-navy-primary'}`}>
            Credify
          </span>
          {showProduct && (
            <span className={`${sizeClasses.product} font-bold ml-1`}>
              <span className={isDark ? 'text-blue-100' : 'text-navy-primary'}>Skill</span>
              <span className="text-orange">Passport</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
};
