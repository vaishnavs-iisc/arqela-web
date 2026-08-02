import React from 'react';

interface ProgressBarProps {
  progress: number;   // 0–100
  label?: string;
  className?: string;
}

/**
 * Animated progress bar using CSS custom properties from globals.css.
 */
export function ProgressBar({ progress, label, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-wider">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-border rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
