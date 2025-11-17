import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Instructor from "./pages/Instructor";
import Admin from "./pages/Admin";
import { ROLES } from "./services/authService";
import AuthCallback from "./pages/AuthCallback";
import AuthError from "./pages/AuthError";

/**
 * Root application with routing and auth provider.
 */

// Simple layout with theme toggle and outlet renderer
function Layout({ children }) {
  const [theme, setTheme] = useState("light");
  const { isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: "auto", padding: 16 }}>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <nav style={{ display: "flex", gap: 12 }}>
          {!isAuthenticated ? (
            <>
              <a className="App-link" href="/signin">Sign in</a>
              <a className="App-link" href="/signup">Sign up</a>
            </>
          ) : (
            <button onClick={signOut} className="btn" style={{ padding: "6px 10px" }}>Sign out</button>
          )}
        </nav>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth/callback" element={<React.Suspense fallback={<div>Loading...</div>}><AuthCallback /></React.Suspense>} />
      <Route path="/auth/error" element={<AuthError />} />

      {/* Protected student dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Instructor-only routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowed={[ROLES.INSTRUCTOR]} />}>
          <Route path="/instructor" element={<Instructor />} />
        </Route>
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowed={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Application entrypoint. Provides auth context and router. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
