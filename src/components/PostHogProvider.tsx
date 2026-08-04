'use client';

import React from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // Checked manually via PostHogPageView.tsx to support Next.js App Router client transitions
      capture_performance: true, // Auto-capture web vitals & network call request latency/times
      enable_recording_console_log: true, // Log client console warnings and errors in session recording
    });
  } else {
    console.warn('[Arqela Telemetry] PostHog API key is not defined. Telemetry remains disabled.');
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
