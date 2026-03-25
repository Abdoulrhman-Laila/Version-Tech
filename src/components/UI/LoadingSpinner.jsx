import React from 'react';
import { useTranslation } from 'react-i18next';
import logoImage from '../../assets/images/logo.jpeg';

const LoadingSpinner = ({ size = 'default', text = true }) => {
  const { t } = useTranslation();

  const sizeClasses = {
    small: 'w-16 h-16',
    default: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizeClasses[size]} text-primary-700 dark:text-primary-200`}>
        {/* Logo-based eagle loader (wings flap) */}
        <svg
          viewBox="0 0 128 128"
          className="h-full w-full drop-shadow-[0_10px_24px_rgba(30,58,138,0.18)] dark:drop-shadow-[0_10px_24px_rgba(77,59,255,0.12)]"
          role="img"
          aria-label={t('common.loading')}
        >
          <defs>
            {/* A subtle frame tint that matches the site */}
            <linearGradient id="logoFrame" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4d3bff" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Wing masks (roughly shaped; uses the logo image as texture) */}
            <mask id="maskWingLeft">
              <rect width="128" height="128" fill="black" />
              <path
                d="M10 74c8-20 24-34 44-40 10-3 21-2 30 1-12 4-20 15-22 28-2 14-14 22-52 18Z"
                fill="white"
              />
              <path
                d="M8 84c18 2 34 0 47-6-10 10-26 18-50 20 0-5 1-10 3-14Z"
                fill="white"
                opacity="0.65"
              />
            </mask>

            <mask id="maskWingRight">
              <rect width="128" height="128" fill="black" />
              <path
                d="M118 74c-8-20-24-34-44-40-10-3-21-2-30 1 12 4 20 15 22 28 2 14 14 22 52 18Z"
                fill="white"
              />
              <path
                d="M120 84c-18 2-34 0-47-6 10 10 26 18 50 20 0-5-1-10-3-14Z"
                fill="white"
                opacity="0.65"
              />
            </mask>

            <mask id="maskBody">
              <rect width="128" height="128" fill="black" />
              {/* Central body/head area to keep stable */}
              <path
                d="M64 26c12 0 22 9 22 22 0 20-15 34-22 44-7-10-22-24-22-44 0-13 10-22 22-22Z"
                fill="white"
              />
            </mask>
          </defs>

          {/* Frame */}
          <rect
            x="14"
            y="14"
            width="100"
            height="100"
            rx="22"
            fill="url(#logoFrame)"
            opacity="0.10"
          />

          {/* Left wing (logo texture, masked + animated) */}
          <g className="origin-[64px_64px] animate-eagle-wing-left" style={{ transformBox: 'fill-box' }}>
            <image href={logoImage} x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid slice" mask="url(#maskWingLeft)" />
          </g>

          {/* Right wing (logo texture, masked + animated) */}
          <g className="origin-[64px_64px] animate-eagle-wing-right" style={{ transformBox: 'fill-box' }}>
            <image href={logoImage} x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid slice" mask="url(#maskWingRight)" />
          </g>

          {/* Body (logo texture, static) */}
          <image href={logoImage} x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid slice" mask="url(#maskBody)" />

          {/* Glow ring */}
          <circle
            cx="64"
            cy="64"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="6"
          />
          <circle
            cx="64"
            cy="64"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.10"
            strokeWidth="2"
          />
        </svg>
      </div>
      
      {text && (
        <p className="mt-4 animate-pulse text-sm font-medium text-primary-700/80 dark:text-primary-200/80">
          {t('common.loading')}
        </p>
      )}

      {/* Local keyframes (scoped) */}
      <style>{`
        @keyframes eagleWingLeft {
          0%, 100% { transform: rotate(-6deg) translateX(-1px) scaleY(0.99); }
          50% { transform: rotate(-18deg) translateX(-2px) scaleY(1.05); }
        }
        @keyframes eagleWingRight {
          0%, 100% { transform: rotate(6deg) translateX(1px) scaleY(0.99); }
          50% { transform: rotate(18deg) translateX(2px) scaleY(1.05); }
        }
        .animate-eagle-wing-left { animation: eagleWingLeft 1.15s ease-in-out infinite; }
        .animate-eagle-wing-right { animation: eagleWingRight 1.15s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;