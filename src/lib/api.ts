/**
 * Typed API client — all fetch() calls live here and nowhere else.
 * Checks both NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_BASE with a localhost fallback.
 */

import type { EvaluationDetail, EvaluationRecord } from '@/types/hypothesis';
import { supabase } from '@/lib/supabase';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000').replace(/\/$/, '');

async function authHeaders(): Promise<HeadersInit> {
  if (!supabase) throw new Error('Sign-in has not been configured.');
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) throw new Error('You must sign in to audit a hypothesis.');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` };
}

// ---------------------------------------------------------------------------
// Hypothesis evaluation (returns a Response so callers can read the SSE stream)
// ---------------------------------------------------------------------------

export async function evaluateHypothesis(
  hypothesis: string,
  domain: string,
  conversationId?: string
): Promise<Response> {
  return fetch(`${API_BASE}/api/hypothesis/evaluate`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ hypothesis, domain, conversation_id: conversationId }),
  });
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export async function fetchHistory(): Promise<EvaluationRecord[]> {
  const res = await fetch(`${API_BASE}/api/hypothesis/history`, { headers: await authHeaders() });
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchDetail(id: string): Promise<EvaluationDetail> {
  const res = await fetch(`${API_BASE}/api/hypothesis/detail/${id}`, { headers: await authHeaders() });
  if (!res.ok) throw new Error(`Detail fetch failed: ${res.status}`);
  return res.json();
}

export async function clearHistory(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/hypothesis/clear`, { method: 'POST', headers: await authHeaders() });
  if (!res.ok) throw new Error(`Clear failed: ${res.status}`);
}

// ---------------------------------------------------------------------------
// Chat (returns a Response so callers can read the SSE stream)
// ---------------------------------------------------------------------------

export async function sendChatMessage(conversationId: string, newMessage: string): Promise<Response> {
  return fetch(`${API_BASE}/api/hypothesis/converse`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ conversation_id: conversationId, new_message: newMessage }),
  });
}
