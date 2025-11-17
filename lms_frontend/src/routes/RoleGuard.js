import React from "react";
import { Outlet } from "react-router-dom";

/**
 * TEMPORARY: Auth/role checks disabled — always allow.
 * TODO(auth): Reinstate role-based access control.
 */

// PUBLIC_INTERFACE
export default function RoleGuard({ allowed = [] }) {
  /** RoleGuard element used in react-router route definitions (temporarily permissive) */
  return <Outlet />;
}
