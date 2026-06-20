import React from 'react';

export const Mascot = ({ expression = 'happy', size = 120 }) => {
  // Common colors
  const bodyColor = 'hsl(260, 100%, 65%)'; // Purple theme owl
  const bellyColor = '#f3f4f6';
  const beakColor = '#ffc800';
  const eyeColor = '#1e293b';

  return (
    <div style={{ width: size, height: size, display: 'inline-block' }} className="animate-mascot">
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Glow behind the mascot */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-green-light)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-green-light)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="110" r="80" fill="url(#glow)" />

        {/* --- Ears / Tufts --- */}
        <path d="M 50 70 L 40 40 L 80 55 Z" fill={bodyColor} stroke="#ffffff" strokeWidth="3" />
        <path d="M 150 70 L 160 40 L 120 55 Z" fill={bodyColor} stroke="#ffffff" strokeWidth="3" />

        {/* --- Body Shape --- */}
        <rect x="45" y="60" width="110" height="100" rx="55" fill={bodyColor} stroke="#ffffff" strokeWidth="4" />

        {/* --- Chest/Belly --- */}
        <path d="M 60 110 A 40 40 0 0 0 140 110 Z" fill={bellyColor} />
        {/* Cute Feathers on Chest */}
        <path d="M 85 120 Q 90 125 95 120" stroke={bodyColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 105 120 Q 110 125 115 120" stroke={bodyColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 95 132 Q 100 137 105 132" stroke={bodyColor} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* --- Wings / Arms --- */}
        {expression === 'happy' && (
          <>
            {/* Left wing resting */}
            <path d="M 45 100 Q 25 110 40 130" stroke="#ffffff" strokeWidth="4" fill={bodyColor} strokeLinecap="round" />
            {/* Right wing waving */}
            <path d="M 155 100 Q 185 80 170 65" stroke="#ffffff" strokeWidth="4" fill={bodyColor} strokeLinecap="round" />
            {/* Waving sparkle lines */}
            <path d="M 180 50 L 190 45" stroke="#ffc800" strokeWidth="3" strokeLinecap="round" />
            <path d="M 185 62 L 198 62" stroke="#ffc800" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {expression === 'thinking' && (
          <>
            {/* Wing on chin */}
            <path d="M 45 100 Q 25 110 40 130" stroke="#ffffff" strokeWidth="4" fill={bodyColor} />
            <path d="M 155 100 Q 130 110 120 130" stroke="#ffffff" strokeWidth="4" fill={bodyColor} />
            {/* Lightbulb glowing above head */}
            <g transform="translate(145, 10) scale(0.6)">
              <circle cx="30" cy="30" r="18" fill="#ffc800" />
              <path d="M 22 42 L 38 42 L 35 50 L 25 50 Z" fill="#94a3b8" />
              {/* Rays */}
              <line x1="30" y1="5" x2="30" y2="0" stroke="#ffc800" strokeWidth="4" strokeLinecap="round" />
              <line x1="12" y1="12" x2="6" y2="6" stroke="#ffc800" strokeWidth="4" strokeLinecap="round" />
              <line x1="48" y1="12" x2="54" y2="6" stroke="#ffc800" strokeWidth="4" strokeLinecap="round" />
            </g>
          </>
        )}

        {expression === 'celebrate' && (
          <>
            {/* Both wings up in the air! */}
            <path d="M 45 90 Q 15 65 25 50" stroke="#ffffff" strokeWidth="4" fill={bodyColor} strokeLinecap="round" />
            <path d="M 155 90 Q 185 65 175 50" stroke="#ffffff" strokeWidth="4" fill={bodyColor} strokeLinecap="round" />
            
            {/* Miniature Graduation Cap */}
            <g transform="translate(70, 20)">
              <polygon points="30,0 60,12 30,24 0,12" fill="#1e293b" stroke="#ffffff" strokeWidth="2" />
              <rect x="18" y="15" width="24" height="12" fill="#1e293b" />
              {/* Yellow tassel */}
              <path d="M 30 12 L 55 15 L 56 26" fill="none" stroke="#ffc800" strokeWidth="2" />
            </g>
          </>
        )}

        {expression === 'confused' && (
          <>
            {/* Wings scratching head */}
            <path d="M 45 90 Q 30 65 42 55" stroke="#ffffff" strokeWidth="4" fill={bodyColor} />
            <path d="M 155 100 Q 170 120 150 130" stroke="#ffffff" strokeWidth="4" fill={bodyColor} />
            {/* Swirly questioning indicator */}
            <text x="160" y="45" fontSize="30" fill="var(--color-red)" fontWeight="bold" fontFamily="Fredoka">?</text>
          </>
        )}

        {/* --- Eyes --- */}
        {expression === 'happy' && (
          <>
            {/* Big friendly round eyes */}
            <circle cx="75" cy="90" r="22" fill="#ffffff" stroke={bodyColor} strokeWidth="3" />
            <circle cx="125" cy="90" r="22" fill="#ffffff" stroke={bodyColor} strokeWidth="3" />
            <circle cx="78" cy="90" r="10" fill={eyeColor} />
            <circle cx="122" cy="90" r="10" fill={eyeColor} />
            {/* White light reflection */}
            <circle cx="75" cy="86" r="3" fill="#ffffff" />
            <circle cx="119" cy="86" r="3" fill="#ffffff" />
          </>
        )}

        {expression === 'thinking' && (
          <>
            {/* Slightly narrowed thinking eyes */}
            <circle cx="75" cy="90" r="22" fill="#ffffff" stroke={bodyColor} strokeWidth="3" />
            <circle cx="125" cy="90" r="22" fill="#ffffff" stroke={bodyColor} strokeWidth="3" />
            <ellipse cx="78" cy="92" rx="9" ry="6" fill={eyeColor} />
            <ellipse cx="122" cy="92" rx="9" ry="6" fill={eyeColor} />
            {/* Eyes looking upwards */}
            <circle cx="76" cy="88" r="3" fill="#ffffff" />
            <circle cx="120" cy="88" r="3" fill="#ffffff" />
          </>
        )}

        {expression === 'celebrate' && (
          <>
            {/* Squinty happy eyes (curved lines) */}
            <path d="M 60 90 Q 75 78 90 90" stroke={eyeColor} strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 110 90 Q 125 78 140 90" stroke={eyeColor} strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        )}

        {expression === 'confused' && (
          <>
            {/* Concentric spiral eyes */}
            <g stroke={eyeColor} strokeWidth="3" fill="none">
              <circle cx="75" cy="90" r="22" fill="#ffffff" stroke={bodyColor} strokeWidth="3" />
              <circle cx="125" cy="90" r="22" fill="#ffffff" stroke={bodyColor} strokeWidth="3" />
              {/* Left spiral */}
              <path d="M 75 90 A 8 8 0 0 1 83 90 A 12 12 0 0 1 71 90 A 16 16 0 0 1 87 90" />
              {/* Right spiral */}
              <path d="M 125 90 A 8 8 0 0 1 133 90 A 12 12 0 0 1 121 90 A 16 16 0 0 1 137 90" />
            </g>
          </>
        )}

        {/* --- Beak --- */}
        <polygon points="90,95 110,95 100,115" fill={beakColor} stroke="#ffffff" strokeWidth="2" />

        {/* --- Cute Blush --- */}
        <ellipse cx="54" cy="104" rx="8" ry="4" fill="var(--color-red)" opacity="0.3" />
        <ellipse cx="146" cy="104" rx="8" ry="4" fill="var(--color-red)" opacity="0.3" />

        {/* --- Feet --- */}
        <path d="M 70 160 Q 75 178 82 165" stroke="#ffffff" strokeWidth="3" fill={beakColor} strokeLinecap="round" />
        <path d="M 80 160 Q 82 178 89 165" stroke="#ffffff" strokeWidth="3" fill={beakColor} strokeLinecap="round" />

        <path d="M 120 160 Q 118 178 111 165" stroke="#ffffff" strokeWidth="3" fill={beakColor} strokeLinecap="round" />
        <path d="M 130 160 Q 125 178 118 165" stroke="#ffffff" strokeWidth="3" fill={beakColor} strokeLinecap="round" />
      </svg>
    </div>
  );
};
