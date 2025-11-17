import React, { createContext, useContext, useMemo } from "react";
import { getRedirectPathForRole } from "../services/authService";

/**
 * AuthContext provides authentication state and actions to the app.
 * TEMPORARY AUTH DISABLED:
 * This file has been modified to provide a safe no-auth default to unblock the app runtime.
 * TODO(auth): Restore real AuthProvider/useAuth behavior when authentication is re-enabled.
 */

// A permissive, non-throwing default context that mimics "logged out" but safe API surface.
const defaultAuth = {
  session: null,
  isAuthenticated: false,
  role: null,
  user: null,
  // No-op asyncs to satisfy call sites without failing
  signIn: async () => {
    // TODO(auth): Wire real sign-in
    return { user: null, role: null, token: "" };
  },
  signUp: async () => {
    // TODO(auth): Wire real sign-up
    return { user: null, role: null, token: "" };
  },
  signOut: async () => {
    // TODO(auth): Wire real sign-out
    return;
  },
  getRedirectPathForRole,
  supabaseReady: false,
};

const AuthContext = createContext(defaultAuth);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions (safe default when provider is absent). */
  // TEMPORARY: Return a safe default even if no provider is mounted.
  // This avoids "must be used within <AuthProvider>" runtime errors.
  try {
    const ctx = useContext(AuthContext);
    return ctx || defaultAuth;
  } catch {
    return defaultAuth;
  }
}

/**
 * Higher-order component retained for compatibility; no-op wrapper while auth is disabled.
 */
// PUBLIC_INTERFACE
export function withAuth(Component) {
  /** Wrap a React component with AuthProvider context (no-op while auth disabled). */
  return function WithAuthWrapper(props) {
    return (
      <NoAuthProvider>
        <Component {...props} />
      </NoAuthProvider>
    );
  };
}

/**
 * TEMPORARY NoAuthProvider:
 * Provides a stable, non-throwing context with unauthenticated defaults.
 * Use this instead of the real AuthProvider while auth is disabled.
 */
// PUBLIC_INTERFACE
export function NoAuthProvider({ children }) {
  /** Provider that exposes a static unauthenticated context. */
  const value = useMemo(() => defaultAuth, []);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * LEGACY EXPORT: AuthProvider
 * Kept to avoid import breakages but delegates to NoAuthProvider for now.
 * TODO(auth): Replace implementation with real provider when re-enabling auth.
 */
// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Temporary alias to NoAuthProvider to keep imports working */
  return <NoAuthProvider>{children}</NoAuthProvider>;
}
