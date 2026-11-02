import React from 'react';

export const WorkerShieldIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange/20 via-blue-500/10 to-transparent blur-3xl rounded-full transform scale-90" />

      <svg
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl relative z-10"
      >
        <defs>
          <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2A5B" />
            <stop offset="100%" stopColor="#183F7D" />
          </linearGradient>
          <linearGradient id="shieldFill" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>
          <linearGradient id="orangeSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F47B20" />
            <stop offset="100%" stopColor="#E0680D" />
          </linearGradient>
        </defs>

        {/* Shield Contour Outline */}
        <path
          d="M260 30L450 75V190C450 295 365 375 260 405C155 375 70 295 70 190V75L260 30Z"
          fill="url(#shieldFill)"
          stroke="url(#shieldBorder)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Dynamic Orange Swoosh Accent across lower shield */}
        <path
          d="M50 270C120 320 220 340 330 290C400 258 460 210 490 180C475 210 410 280 320 310C210 345 110 325 50 270Z"
          fill="url(#orangeSwoosh)"
          opacity="0.95"
        />

        {/* Worker Character 1: Central Electrician with Yellow Hard Hat */}
        <g id="worker-center">
          {/* Body / Orange Safety Vest */}
          <path
            d="M260 195C220 195 190 225 185 280L335 280C330 225 300 195 260 195Z"
            fill="#F47B20"
          />
          <path d="M225 215L235 280M285 215L275 280" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M220 245H300" stroke="#FFFFFF" strokeWidth="5" />

          {/* Neck */}
          <rect x="248" y="175" width="24" height="25" rx="4" fill="#D97706" opacity="0.3" />
          <rect x="250" y="172" width="20" height="24" rx="4" fill="#FBBF24" />

          {/* Face */}
          <circle cx="260" cy="155" r="28" fill="#FDE68A" />
          {/* Eyes & Smile */}
          <circle cx="250" cy="152" r="3" fill="#0B2A5B" />
          <circle cx="270" cy="152" r="3" fill="#0B2A5B" />
          <path d="M253 164C257 169 263 169 267 164" stroke="#0B2A5B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Yellow Hard Hat */}
          <path d="M225 142C225 118 240 102 260 102C280 102 295 118 295 142H225Z" fill="#FACC15" />
          <rect x="218" y="138" width="84" height="8" rx="4" fill="#EAB308" />
          <path d="M255 102V138" stroke="#CA8A04" strokeWidth="3" />
        </g>

        {/* Worker Character 2: Left Blue Collar Worker / Plumber with Cap & Wrench */}
        <g id="worker-left">
          {/* Blue Dungarees */}
          <path d="M165 220C135 220 115 245 110 290L210 290C205 245 185 220 165 220Z" fill="#1E40AF" />
          <circle cx="165" cy="180" r="22" fill="#FDE68A" />
          {/* Blue Cap */}
          <path d="M142 170C142 152 152 142 165 142C178 142 188 152 188 170H142Z" fill="#1D4ED8" />
          <path d="M140 170H198" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
          {/* Spanner / Wrench */}
          <path
            d="M195 240L215 200M215 200C218 195 225 195 228 200L222 210"
            stroke="#64748B"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* Worker Character 3: Right Technician / Skilled Grey Collar */}
        <g id="worker-right">
          <path d="M355 220C335 220 315 245 310 290L410 290C405 245 385 220 355 220Z" fill="#0EA5E9" />
          <circle cx="355" cy="180" r="22" fill="#FED7AA" />
          {/* Safety Goggles & Hair */}
          <path d="M338 170C338 150 348 140 355 140C362 140 372 150 372 170" fill="#334155" />
          <rect x="342" y="172" width="26" height="10" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        </g>

        {/* Worker Character 4: Female Healthcare / Hospitality Specialist */}
        <g id="worker-far-right">
          <circle cx="410" cy="195" r="18" fill="#FDE68A" />
          <path d="M395 190C395 178 402 170 410 170C418 170 425 178 425 190" fill="#3B82F6" />
          <path d="M410 225C395 225 380 245 375 285L440 285C435 245 425 225 410 225Z" fill="#2563EB" />
        </g>

        {/* Floating Verified Shield Badges */}
        <g id="badge-floating">
          <circle cx="100" cy="110" r="24" fill="#2E9E5B" />
          <path d="M90 110L97 117L111 103" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};
