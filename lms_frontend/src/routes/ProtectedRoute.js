import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protects routes requiring authentication.
 * Redirects unauthenticated users to /signin with 'from' state.
 */

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  /** ProtectedRoute element used in react-router route definitions */
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
