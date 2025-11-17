import React from "react";
import { Outlet } from "react-router-dom";

/**
 * TEMPORARY: Auth disabled — always allow.
 * TODO(auth): Reinstate authentication check and redirect logic.
 */

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  /** ProtectedRoute element used in react-router route definitions (temporarily permissive) */
  return <Outlet />;
}
