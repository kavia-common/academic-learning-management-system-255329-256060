import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Restrict access to users with specific roles.
 * Usage: <Route element={<RoleGuard allowed={['Admin']} />}> ... </Route>
 */

/* Uses role from AuthContext; must be rendered under <AuthProvider />. */
// PUBLIC_INTERFACE
export default function RoleGuard({ allowed = [] }) {
  /** RoleGuard element used in react-router route definitions */
  const { role } = useAuth();
  if (!allowed.includes(role)) {
    // If role not allowed, send to default dashboard based on their role (or signin if unknown)
    if (!role) return <Navigate to="/signin" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
