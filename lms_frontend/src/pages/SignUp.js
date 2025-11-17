import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROLES, getRedirectPathForRole } from "../services/authService";

/**
 * Sign Up Page
 * TEMPORARY: No real authentication performed; validates and navigates to a role-based default.
 * TODO(auth): Wire to useAuth.signUp when auth is re-enabled.
 */

// PUBLIC_INTERFACE
export default function SignUp() {
  /** SignUp page component (no real auth) */
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.STUDENT,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword) errs.confirmPassword = "Confirm your password.";
    else if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match.";
    if (!form.role || !Object.values(ROLES).includes(form.role)) errs.role = "Select a valid role.";
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    // Simulate success and navigate to role path
    const target = getRedirectPathForRole(form.role);
    navigate(target, { replace: true });
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={onSubmit} style={styles.card} noValidate>
        <h1 style={styles.title}>Create your account</h1>
        <div style={styles.field}>
          <label htmlFor="name" style={styles.label}>Name</label>
          <input
            id="name"
            name="name"
            type="text"
            style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
            value={form.name}
            onChange={onChange}
            autoComplete="name"
            required
          />
          {errors.name && <div style={styles.errorText}>{errors.name}</div>}
        </div>
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
            autoComplete="new-password"
            required
          />
          {errors.password && <div style={styles.errorText}>{errors.password}</div>}
        </div>
        <div style={styles.field}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
            value={form.confirmPassword}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
          {errors.confirmPassword && <div style={styles.errorText}>{errors.confirmPassword}</div>}
        </div>
        <div style={styles.field}>
          <label htmlFor="role" style={styles.label}>Role</label>
          <select
            id="role"
            name="role"
            style={{ ...styles.input, ...(errors.role ? styles.inputError : {}) }}
            value={form.role}
            onChange={onChange}
            required
          >
            <option value={ROLES.STUDENT}>Student</option>
            <option value={ROLES.INSTRUCTOR}>Instructor</option>
            <option value={ROLES.ADMIN}>Admin</option>
          </select>
          {errors.role && <div style={styles.errorText}>{errors.role}</div>}
        </div>
        <button type="submit" disabled={submitting} style={styles.submit}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
        <p style={styles.muted}>
          Already have an account? <Link to="/signin" style={styles.link}>Sign in</Link>
        </p>
        <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
          Note: Authentication is temporarily disabled. This form will navigate without creating an account. {/* TODO(auth) */}
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-secondary)" },
  card: { width: "100%", maxWidth: 480, background: "white", border: "1px solid #E5E7EB", borderRadius: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", padding: 24 },
  title: { margin: "0 0 16px 0", fontSize: 22, fontWeight: 600, color: "var(--text-primary)" },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 14, outline: "none", background: "#fff" },
  inputError: { borderColor: "#EF4444" },
  errorText: { color: "#B91C1C", fontSize: 12, marginTop: 6 },
  submit: { width: "100%", marginTop: 8, padding: "10px 12px", borderRadius: 10, border: "none", background: "#2563EB", color: "#fff", fontWeight: 600, cursor: "pointer" },
  muted: { fontSize: 13, color: "#6B7280", marginTop: 12, textAlign: "center" },
  link: { color: "#2563EB", textDecoration: "none" },
  alert: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", padding: "8px 10px", borderRadius: 8, marginBottom: 12, fontSize: 13 },
};
