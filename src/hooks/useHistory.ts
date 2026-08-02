'use client';

import { useState, useCallback } from 'react';
import { fetchHistory, fetchDetail, clearHistory as apiClearHistory } from '@/lib/api';
import type { EvaluationRecord, EvaluationDetail } from '@/types/hypothesis';

interface UseHistoryReturn {
  history: EvaluationRecord[];
  isDetailLoading: boolean;
  loadHistory: () => Promise<void>;
  loadDetail: (id: string) => Promise<EvaluationDetail | null>;
  clearHistory: () => Promise<boolean>;
}

/**
 * Manages hypothesis evaluation history — list, detail loading, and clearing.
 */
export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<EvaluationRecord[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  }, []);

  const loadDetail = useCallback(async (id: string): Promise<EvaluationDetail | null> => {
    setIsDetailLoading(true);
    try {
      return await fetchDetail(id);
    } catch (err) {
      console.error('Error loading detail:', err);
      return null;
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const clearHistory = useCallback(async (): Promise<boolean> => {
    try {
      await apiClearHistory();
      setHistory([]);
      return true;
    } catch (err) {
      console.error('Error clearing history:', err);
      return false;
    }
  }, []);

  return { history, isDetailLoading, loadHistory, loadDetail, clearHistory };
}
