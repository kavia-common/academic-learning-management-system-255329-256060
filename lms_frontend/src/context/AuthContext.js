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

// Helper to infer best-effort callsite for clearer error messages
function inferCallerInfo() {
  try {
    const stack = new Error().stack || "";
    // Try to find first stack frame outside this file
    const lines = stack.split("\n").map((l) => l.trim());
    const external = lines.find(
      (l) =>
        l.includes(".js") &&
        !l.includes("AuthContext.js") &&
        !l.includes("useContext") &&
        !l.includes("Object.useAuth")
    );
    return external || "";
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    const hint = inferCallerInfo();
    const suggestion =
      "useAuth must be used within <AuthProvider />. Ensure your component tree is wrapped: <BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter> (in src/index.js). If you are rendering a page/component directly in tests or stories, wrap it with <AuthProvider>.";
    const details = hint ? `${suggestion} Callsite: ${hint}` : suggestion;
    throw new Error(details);
  }
  return ctx;
}

/**
 * Higher-order component to ensure a component is wrapped with AuthProvider.
 * Useful for stories/tests/dev harnesses that might mount components in isolation.
 */
// PUBLIC_INTERFACE
export function withAuth(Component) {
  /** Wrap a React component with AuthProvider context */
  return function WithAuthWrapper(props) {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };
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
