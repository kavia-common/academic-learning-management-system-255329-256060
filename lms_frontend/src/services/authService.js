"use strict";

/**
 * Auth Service using Supabase email/password flows, with role persistence via profiles table.
 * Uses env vars for configuration; falls back to mock mode when not configured.
 */

import { getSupabase, isSupabaseConfigured as isClientConfigured } from "../utils/supabaseClient";
import { getURL } from "../utils/getURL";

// Internal in-memory session cache (mirrors supabase auth state)
let _session = null;

// Keys (legacy support for initial load before supabase session retrieval)
const STORAGE_KEY = "lms.session.v1";

// Roles
export const ROLES = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
};

// PUBLIC_INTERFACE
export function getEnvConfig() {
  /**
   * Reads environment variables for config.
   */
  return {
    apiBase: process.env.REACT_APP_API_BASE || "",
    backendUrl: process.env.REACT_APP_BACKEND_URL || "",
    frontendUrl: process.env.REACT_APP_FRONTEND_URL || "",
    wsUrl: process.env.REACT_APP_WS_URL || "",
    nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development",
    featureFlags: process.env.REACT_APP_FEATURE_FLAGS || "",
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || "",
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || "",
    siteUrl: process.env.REACT_APP_SITE_URL || "",
  };
}

// PUBLIC_INTERFACE
export function isSupabaseConfigured() {
  /**
   * Returns true if Supabase envs are present.
   */
  return isClientConfigured();
}

/**
 * Try loading a saved legacy session (mock) to avoid breaking UI before supabase is configured.
 * In Supabase mode we instead read session from supabase.
 */
(function initFromStorage() {
  if (_session) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user && parsed.role) {
        _session = parsed;
      }
    }
  } catch {
    // ignore parse/storage errors
  }
})();

async function readProfileRole(userId) {
  const supabase = getSupabase();
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("role, full_name, email, id")
    .eq("id", userId)
    .single();
  if (error) {
    return null;
  }
  return {
    role: data?.role || ROLES.STUDENT,
    profile: data || null,
  };
}

function shapeSessionFromSupabase(supabaseSession, roleFallback = ROLES.STUDENT, profile = null) {
  const user = supabaseSession?.user;
  if (!user) return null;
  const shaped = {
    user: {
      id: user.id,
      name: profile?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
      email: user.email || profile?.email || "",
    },
    role: profile?.role || roleFallback,
    token: supabaseSession?.access_token || "",
  };
  try {
    // Keep a light cache for quick reloads
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shaped));
  } catch {
    // ignore storage errors
  }
  return shaped;
}

// PUBLIC_INTERFACE
export async function signIn(email, password) {
  /**
   * Sign in with Supabase or error when not configured (UI will show mock mode).
   */
  if (!email || !password) throw new Error("Email and password are required.");
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.");
  }
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const supaSession = data.session;
  const userId = data.user?.id || supaSession?.user?.id;
  const { role, profile } = (await readProfileRole(userId)) || { role: ROLES.STUDENT, profile: null };
  const shaped = shapeSessionFromSupabase(supaSession || { user: data.user, access_token: "" }, role, profile);
  _session = shaped;
  return shaped;
}

// PUBLIC_INTERFACE
export async function signUp({ name, email, password, confirmPassword, role }) {
  /**
   * Sign up a user with Supabase. Inserts/upserts into profiles table with role.
   * Redirects via email with emailRedirectTo set to SITE_URL/auth/callback when email confirmations enabled.
   */
  if (!name || !email || !password || !confirmPassword || !role) {
    throw new Error("All fields are required.");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
  if (!Object.values(ROLES).includes(role)) {
    throw new Error("Invalid role selected.");
  }
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.");
  }
  const supabase = getSupabase();

  const redirectTo = `${getURL()}auth/callback`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        name,
      },
    },
  });
  if (error) throw error;

  const userId = data.user?.id;
  if (userId) {
    // Upsert profile with chosen role and full_name
    const { error: perr } = await supabase.from("profiles").upsert(
      {
        id: userId,
        email,
        full_name: name,
        role,
      },
      { onConflict: "id" }
    );
    if (perr) {
      // Non-fatal; profile trigger may fill defaults. Continue.
      // eslint-disable-next-line no-console
      console.warn("Profile upsert warning:", perr.message);
    }
  }

  // If email confirmation is required, session might be null until confirmation.
  // Attempt to shape session if present; otherwise return a minimal session to drive UX.
  const supaSession = data.session;
  if (!supaSession) {
    const pending = {
      user: { id: userId || "", name, email },
      role,
      token: "",
    };
    _session = pending;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
    } catch {}
    return pending;
  }

  const { role: confirmedRole, profile } = (await readProfileRole(userId)) || { role, profile: null };
  const shaped = shapeSessionFromSupabase(supaSession, confirmedRole, profile);
  _session = shaped;
  return shaped;
}

// PUBLIC_INTERFACE
export function getSession() {
  /**
   * Get current session from cache or legacy storage (mock fallback).
   */
  if (_session) return _session;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user && parsed.role) {
        _session = parsed;
      }
    }
  } catch {}
  return _session;
}

// PUBLIC_INTERFACE
export async function signOut() {
  /**
   * Sign out from Supabase when configured and clear cache.
   */
  const supabase = getSupabase();
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // ignore
  }
  _session = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// PUBLIC_INTERFACE
export function getRedirectPathForRole(role) {
  /**
   * Get default redirect path for a role.
   */
  switch (role) {
    case ROLES.ADMIN:
      return "/admin";
    case ROLES.INSTRUCTOR:
      return "/instructor";
    case ROLES.STUDENT:
    default:
      return "/dashboard";
  }
}

// PUBLIC_INTERFACE
export function subscribeToAuthChanges(callback) {
  /**
   * Subscribe to Supabase auth state changes; callback receives shaped session or null.
   * Returns unsubscribe function. No-ops in mock mode.
   */
  const supabase = getSupabase();
  if (!supabase) {
    // In mock mode, return a no-op unsubscribe
    return () => {};
  }
  const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session) {
      _session = null;
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
      callback(null);
      return;
    }
    const userId = session.user?.id;
    const { role, profile } = (await readProfileRole(userId)) || { role: ROLES.STUDENT, profile: null };
    const shaped = shapeSessionFromSupabase(session, role, profile);
    _session = shaped;
    callback(shaped);
  });
  return () => {
    sub?.subscription?.unsubscribe();
  };
}
