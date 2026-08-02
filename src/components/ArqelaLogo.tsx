import React from 'react';

interface ArqelaLogoProps {
  className?: string;
}

/**
 * Arqela brand mark — a layered A / aperture built from connected evidence paths.
 */
export function ArqelaLogo({ className = 'w-5 h-5' }: ArqelaLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer frame: a research path converging on a shared question. */}
      <path
        d="M3.5 19.5 10.8 4.1c.45-.96 1.82-.96 2.27 0l7.43 15.4"
        stroke="currentColor"
        strokeWidth="2.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner frame creates an aperture, making the A feel dimensional. */}
      <path
        d="m7.3 19.5 4.64-9.9 4.75 9.9M8.9 15.65h6.2"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.72"
      />

      {/* Evidence connections. */}
      <path
        d="M5.55 15.15 9.25 12.8M14.85 12.8l3.58 2.35"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="5.15" cy="15.4" r="1.3" fill="currentColor" />
      <circle cx="18.85" cy="15.4" r="1.3" fill="currentColor" opacity="0.7" />
      <circle cx="11.93" cy="5.75" r="1.72" fill="#B45309" />
    </svg>
  );
}
