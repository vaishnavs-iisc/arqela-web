import React from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LoadingScreenProps {
  progress: number;
  message: string;
}

/**
 * Full-pane loading state shown while the multi-agent evaluation runs.
 */
export function LoadingScreen({ progress, message }: LoadingScreenProps) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center space-y-5 max-w-sm mx-auto animate-fade-in">
      <ProgressBar progress={progress} label="Arqela Analysing…" />
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-foreground">{message}</h3>
        <p className="text-[10px] text-foreground/50">Multi-agent research loop active in backend.</p>
      </div>
    </div>
  );
}
