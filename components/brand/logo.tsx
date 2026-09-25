import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

/**
 * Official EaseLife Logo
 * Extracted from EaseLife_brand_sheet.jpg
 * - North Blue: #235789 (Outer circle 'e')
 * - Momentum Teal: #00A896 (Upward arrow)
 * - Growth Green: #60D394 (Sprout leaf)
 */
export function EaseLifeIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EaseLife Logo Icon"
    >
      {/* Outer circular 'e' body in North Blue */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="#235789"
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray="210 50"
        transform="rotate(-40 50 50)"
      />

      {/* Crossbar of 'e' */}
      <path
        d="M20 50H56"
        stroke="#235789"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Momentum Teal Upward Diagonal Arrow */}
      <path
        d="M32 76C42 76 54 66 66 52L82 34"
        stroke="#00A896"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <path
        d="M66 26H86V46L76 36L66 26Z"
        fill="#00A896"
      />

      {/* Growth Green Sprout Leaf */}
      <path
        d="M52 46C52 32 64 22 72 20C72 32 62 44 52 46Z"
        fill="#60D394"
      />
    </svg>
  );
}

export function EaseLifeLogo({
  size = 32,
  showText = true,
  showTagline = false,
  className = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <EaseLifeIcon size={size} className="shrink-0" />
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-[17px] font-bold tracking-tight text-[#235789] leading-none">
            EaseLife
          </span>
          {showTagline && (
            <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-1 leading-none">
              Structure Your Vision. Ease Your Days.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
