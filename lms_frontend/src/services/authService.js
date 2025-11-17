"use strict";

/**
 * Auth Service (mock for now).
 * Supabase-ready notes:
 * - A real implementation should call supabase.auth.signUp/signIn and read `profiles.role`.
 * - For signUp/signIn redirects, pass redirectTo/emailRedirectTo = `${getURL()}auth/callback`.
 * - Do not hardcode URLs; rely on REACT_APP_SITE_URL and utils/getURL.js.
 */

// Internal in-memory session cache
let _session = null;

// Keys
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
   * Get optional environment configuration. In mock phase, these are not required.
   * Reads from REACT_APP_* variables if present.
   */
  return {
    apiBase: process.env.REACT_APP_API_BASE || "",
    backendUrl: process.env.REACT_APP_BACKEND_URL || "",
    frontendUrl: process.env.REACT_APP_FRONTEND_URL || "",
    wsUrl: process.env.REACT_APP_WS_URL || "",
    nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development",
    featureFlags: process.env.REACT_APP_FEATURE_FLAGS || "",
  };
}

/**
 * Try loading a saved session on module load.
 */
(function initFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user && parsed.token && parsed.role) {
        _session = parsed;
      }
    }
  } catch {
    // ignore parse/storage errors in mock mode
  }
})();

// PUBLIC_INTERFACE
export async function signIn(email, password) {
  /**
   * Sign in a user using mock validation.
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: {id: string, name: string, email: string}, role: string, token: string}>}
   */
  // Basic mock validation
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }
  // Use deterministic role mapping for mock:
  // admin@ -> Admin, instructor@ -> Instructor, else Student
  let role = ROLES.STUDENT;
  if (/^admin@/i.test(email)) role = ROLES.ADMIN;
  else if (/^instructor@/i.test(email)) role = ROLES.INSTRUCTOR;

  const session = {
    user: {
      id: btoa(email).slice(0, 12),
      name: email.split("@")[0].replace(/\./g, " "),
      email,
    },
    role,
    token: btoa(`${email}:${Date.now()}`),
  };
  _session = session;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // storage might be unavailable
  }
  return session;
}

// PUBLIC_INTERFACE
export async function signUp({ name, email, password, confirmPassword, role }) {
  /**
   * Sign up a user (mock). In real integration, this will call Supabase.
   * @param {Object} payload
   * @param {string} payload.name
   * @param {string} payload.email
   * @param {string} payload.password
   * @param {string} payload.confirmPassword
   * @param {string} payload.role - One of ROLES
   * @returns {Promise<{user: {id: string, name: string, email: string}, role: string, token: string}>}
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
  // In mock, immediately create a session
  const session = {
    user: {
      id: btoa(email).slice(0, 12),
      name,
      email,
    },
    role,
    token: btoa(`${email}:${Date.now()}`),
  };
  _session = session;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
  return session;
}

// PUBLIC_INTERFACE
export function getSession() {
  /**
   * Get current session if present.
   * @returns {{user: {id: string, name: string, email: string}, role: string, token: string} | null}
   */
  return _session;
}

// PUBLIC_INTERFACE
export function signOut() {
  /**
   * Clear current session.
   */
  _session = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
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
