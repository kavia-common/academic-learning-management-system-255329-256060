import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getSession,
  signIn as svcSignIn,
  signUp as svcSignUp,
  signOut as svcSignOut,
  getRedirectPathForRole,
  isSupabaseConfigured,
  subscribeToAuthChanges,
} from "../services/authService";

/**
 * AuthContext provides authentication state and actions to the app.
 */

const AuthContext = createContext(undefined);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * AuthProvider component that wraps the app and provides auth state.
   */
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady] = useState(isSupabaseConfigured());

  // Initialize from service
  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
    setLoading(false);

    // if Supabase is configured, keep session in sync with auth state changes
    let unsub = null;
    if (supabaseReady) {
      unsub = subscribeToAuthChanges((next) => {
        // next is { user, role } or null
        setSession(next);
      });
    }
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [supabaseReady]);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: !!session,
      role: session?.role || null,
      user: session?.user || null,
      signIn: async (email, password) => {
        const s = await svcSignIn(email, password);
        setSession(s);
        return s;
      },
      signUp: async (payload) => {
        const s = await svcSignUp(payload);
        setSession(s);
        return s;
      },
      signOut: async () => {
        await svcSignOut();
        setSession(null);
      },
      getRedirectPathForRole,
      supabaseReady,
    }),
    [session, supabaseReady]
  );

  if (loading) {
    return <div aria-busy="true" style={{ padding: 24 }}>Loading...</div>;
  }

  if (!supabaseReady) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 18, marginBottom: 8 }}>Supabase not configured</h1>
        <p style={{ marginBottom: 12 }}>
          Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in lms_frontend/.env and restart the dev server.
        </p>
        <p>
          See assets/supabase.md and README for setup steps. The app is running in setup mode and will not persist data.
        </p>
        {children}
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
