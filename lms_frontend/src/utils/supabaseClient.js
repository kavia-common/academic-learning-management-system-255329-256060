import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client factory with robust environment guards.
 * Prevents constructing a client when env vars are missing.
 */

// Cache variables within module scope to avoid re-reading process.env repeatedly
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

/**
 * Determine if Supabase is configured based on presence of env vars.
 */
export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// Internal singleton reference (initialized only when configured)
let client = null;

// PUBLIC_INTERFACE
export function getSupabase() {
  /** Returns the Supabase client instance when configured; otherwise null. */
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (client) return client;

  // Lazily create the client to avoid construction during initial import if envs are missing
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

// Backwards compatibility export for legacy imports
// NOTE: Will be null when not configured; prefer getSupabase()
export const supabase = getSupabase();

// Helpful console guidance once (development only)
if (!isSupabaseConfigured()) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY not set. Running in mock mode. See assets/supabase.md and lms_frontend/README.md."
  );
}
