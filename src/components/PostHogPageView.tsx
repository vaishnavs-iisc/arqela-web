'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

/**
 * Pageview tracking component for Next.js App Router.
 * Must be wrapped inside a <Suspense> boundary when rendered in layout.tsx
 * to avoid de-optimizing static generation due to useSearchParams.
 */
export function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      const searchStr = searchParams?.toString();
      if (searchStr) {
        url += `?${searchStr}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
