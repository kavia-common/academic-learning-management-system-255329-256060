import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSession, signIn as svcSignIn, signUp as svcSignUp, signOut as svcSignOut, getRedirectPathForRole } from "../services/authService";

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

  // Initialize from service (localStorage)
  useEffect(() => {
    const s = getSession();
    if (s) setSession(s);
    setLoading(false);
  }, []);

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
      signOut: () => {
        svcSignOut();
        setSession(null);
      },
      getRedirectPathForRole,
    }),
    [session]
  );

  if (loading) {
    return <div aria-busy="true" style={{ padding: 24 }}>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
