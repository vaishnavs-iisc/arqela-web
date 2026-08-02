import React from 'react';

type ScoreLevel = 'good' | 'medium' | 'poor';

interface ScoreBarProps {
  label: string;
  score: number;   // 1–5
  max?: number;
  tooltip?: string;
}

function getScoreLevel(score: number): ScoreLevel {
  if (score >= 4) return 'good';
  if (score === 3) return 'medium';
  return 'poor';
}

const scoreLevelClasses: Record<ScoreLevel, string> = {
  good:   'bg-success shadow-sm',
  medium: 'bg-warning shadow-sm',
  poor:   'bg-danger shadow-sm',
};

/**
 * Five-block score bar used on the vulnerability panel.
 * Colours come from CSS custom properties — no inline hex values.
 */
export function ScoreBar({ label, score, max = 5, tooltip }: ScoreBarProps) {
  const level = getScoreLevel(score);
  const filledClass = scoreLevelClasses[level];

  return (
    <div className="space-y-1 bg-border-muted border border-border/60 p-2.5 rounded-lg">
      <div className="flex justify-between items-center text-[9px] font-bold text-foreground/70 uppercase tracking-wider">
        <span>{label}</span>
        <span className="font-bold text-primary">{score}/{max}</span>
      </div>
      <div className="grid grid-cols-5 gap-1 pt-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map(block => (
          <div
            key={block}
            title={tooltip}
            className={`h-1.5 rounded-full transition-all ${
              block <= score ? filledClass : 'bg-border/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
