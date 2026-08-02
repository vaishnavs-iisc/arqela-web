import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isAuthConfigured = Boolean(url && publishableKey);

export const supabase: SupabaseClient | null = isAuthConfigured
  ? createClient(url!, publishableKey!)
  : null;
