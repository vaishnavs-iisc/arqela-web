'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackWebVital } from '@/lib/telemetry';

/**
 * WebVitals client component.
 * Uses Next.js native useReportWebVitals to measure LCP, FID, CLS, FCP, TTFB, INP.
 * Dispatches performance events to our telemetry service.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    trackWebVital(metric);
  });

  return null;
}
