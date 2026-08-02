import React from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LoadingScreenProps {
  progress: number;
  message: string;
}

/**
 * Full-pane loading state shown while the multi-agent evaluation runs, with live estimated seconds remaining.
 */
export function LoadingScreen({ progress, message }: LoadingScreenProps) {
  // Calculate estimated seconds remaining based on progress percentage (total ~16s)
  const getEstimatedSeconds = (pct: number) => {
    if (pct <= 5) return '15 seconds';
    if (pct <= 25) return '10 seconds';
    if (pct <= 50) return '6 seconds';
    if (pct <= 75) return '3 seconds';
    return '1 second';
  };

  const timeRemaining = getEstimatedSeconds(progress);

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center space-y-5 max-w-sm mx-auto animate-fade-in">
      <ProgressBar progress={progress} label="Arqela Analysing…" />
      <div className="space-y-1.5">
        <h3 className="text-xs font-semibold text-foreground">{message}</h3>
        <p className="text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-md px-2.5 py-1 inline-block">
          Estimated completion: ~{timeRemaining}
        </p>
      </div>
    </div>
  );
}
