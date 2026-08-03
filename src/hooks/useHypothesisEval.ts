'use client';

import { useState } from 'react';
import { evaluateHypothesis } from '@/lib/api';
import type { EvaluationDetail } from '@/types/hypothesis';

interface UseHypothesisEvalReturn {
  isLoading: boolean;
  loadingLog: string;
  loadingProgress: number;
  handleEvaluate: (
    hypothesis: string,
    domain: string,
    onResult: (detail: EvaluationDetail) => void,
    onError: () => void,
    conversationId?: string
  ) => Promise<void>;
}

/**
 * Manages the hypothesis evaluation SSE stream and loading state.
 */
export function useHypothesisEval(): UseHypothesisEvalReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState('Initiating review process...');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleEvaluate = async (
    hypothesis: string,
    domain: string,
    onResult: (detail: EvaluationDetail) => void,
    onError: () => void,
    conversationId?: string
  ) => {
    setIsLoading(true);
    setLoadingProgress(5);
    setLoadingLog('Deconstructing hypothesis structures...');

    try {
      const response = await evaluateHypothesis(hypothesis, domain, conversationId);

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Evaluation request failed (${response.status}): ${errorText || 'Server error'}`);
        onError();
        return;
      }

      if (!response.body) {
        alert('Server response stream unavailable.');
        onError();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.type === 'progress') {
              setLoadingProgress(parsed.percentage);
              setLoadingLog(parsed.message);
              if (parsed.partial_state) {
                onResult(parsed.partial_state as EvaluationDetail);
              }
            } else if (parsed.type === 'result') {
              onResult(parsed.data as EvaluationDetail);
            } else if (parsed.type === 'error') {
              alert(`Evaluation error: ${parsed.message || 'Processing error'}`);
              onError();
            }
          } catch {
            // malformed chunk — skip
          }
        }
      }
    } catch (err: any) {
      alert(`Connection error: ${err?.message || 'Could not connect to backend service.'}`);
      onError();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, loadingLog, loadingProgress, handleEvaluate };
}
