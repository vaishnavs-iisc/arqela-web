/**
 * Telemetry client wrapper — forwards events to PostHog.
 * Provides backwards compatibility for manual event tracking and Web Vitals logging.
 */

import posthog from 'posthog-js';

// Helper to check if PostHog is active and in client-side context
const isPostHogActive = () => {
  return typeof window !== 'undefined' && Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN);
};

export function trackEvent(name: string, payload?: Record<string, any>) {
  if (isPostHogActive()) {
    posthog.capture(name, payload);
  } else {
    console.debug(`[Telemetry Mock] Event: ${name}`, payload);
  }
}

export function trackError(error: any, fatal = false, extra?: Record<string, any>) {
  let message = 'Unknown Error';
  let stack = '';
  
  if (error instanceof Error) {
    message = error.message;
    stack = error.stack || '';
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    message = error.message || JSON.stringify(error);
    stack = error.stack || '';
  }

  if (isPostHogActive()) {
    posthog.capture('$exception', {
      message,
      stack,
      fatal,
      ...extra
    });
  } else {
    console.debug(`[Telemetry Mock] Error: ${message}`, { stack, fatal, ...extra });
  }
}

export function trackWebVital(metric: { name: string; id: string; value: number }) {
  if (isPostHogActive()) {
    posthog.capture('web-vital', {
      metric_name: metric.name,
      metric_id: metric.id,
      value: metric.value,
    });
  } else {
    console.debug(`[Telemetry Mock] WebVital: ${metric.name}`, metric.value);
  }
}

/**
 * Legacy hook for tracking individual network calls.
 * PostHog performance capturing automatically tracks network logs inside session recordings.
 * Leaving this stub for compatibility purposes.
 */
export function trackNetworkCall(
  url: string,
  method: string,
  status: number,
  durationMs: number,
  error?: string
) {
  // PostHog handles network request logging automatically out-of-the-box.
}
