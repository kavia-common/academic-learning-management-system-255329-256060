import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRedirectPathForRole } from "../services/authService";

/**
 * Sign In Page
 * TEMPORARY: No real authentication performed; acts as a plain form then navigates to dashboard.
 * TODO(auth): Wire to useAuth.signIn when auth is re-enabled.
 */

// PUBLIC_INTERFACE
export default function SignIn() {
  /** SignIn page component (no real auth) */
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    // Simulate success and navigate
    const target = from || getRedirectPathForRole("Student");
    navigate(target, { replace: true });
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={onSubmit} style={styles.card} noValidate>
        <h1 style={styles.title}>Sign in</h1>
        <div style={styles.field}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
            value={form.email}
            onChange={onChange}
            autoComplete="email"
            required
          />
          {errors.email && <div style={styles.errorText}>{errors.email}</div>}
        </div>
        <div style={styles.field}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
            required
          />
          {errors.password && <div style={styles.errorText}>{errors.password}</div>}
        </div>
        <button type="submit" disabled={submitting} style={styles.submit}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p style={styles.muted}>
          No account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
        <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
          Note: Authentication is temporarily disabled. This form will navigate without logging in. {/* TODO(auth) */}
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-secondary)" },
  card: { width: "100%", maxWidth: 420, background: "white", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", padding: 24 },
  title: { margin: "0 0 16px 0", fontSize: 22, fontWeight: 600, color: "var(--text-primary)" },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 14, outline: "none" },
  inputError: { borderColor: "#EF4444" },
  errorText: { color: "#B91C1C", fontSize: 12, marginTop: 6 },
  submit: { width: "100%", marginTop: 8, padding: "10px 12px", borderRadius: 10, border: "none", background: "#2563EB", color: "#fff", fontWeight: 600, cursor: "pointer" },
  muted: { fontSize: 13, color: "#6B7280", marginTop: 12, textAlign: "center" },
  link: { color: "#2563EB", textDecoration: "none" },
};
