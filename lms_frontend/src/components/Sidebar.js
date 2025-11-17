import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar component with profile header and navigation.
 * Implements design from assets/sidebar_component_design_notes.md using Ocean Professional theme tokens.
 * TEMPORARY: Auth disabled — show placeholder user info.
 * TODO(auth): Replace placeholder with actual user/role from useAuth when re-enabled.
 */

// Inline SVG icon primitives (16px), using currentColor
function IconDashboard(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z"></path>
    </svg>
  );
}
function IconBook(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18 2H8a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h10v6h2V4a2 2 0 0 0-2-2zM8 14a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2h10v10H8z"></path>
    </svg>
  );
}
function IconPin(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a6 6 0 0 0-6 6c0 4.5 6 14 6 14s6-9.5 6-14a6 6 0 0 0-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
    </svg>
  );
}
function IconDoc(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12V8l-4-6zM6 4h7v5h5v11H6V4z"></path>
    </svg>
  );
}
function IconUser(props) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"></path>
    </svg>
  );
}

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar with profile and nav items (auth disabled) */
  const location = useLocation();
  const placeholderUser = { name: "Student Name", email: "", role: "Student" };

  const items = [
    { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { key: "courses", label: "Courses", href: "/dashboard#courses", icon: IconBook },
    { key: "quizzes", label: "Quizzes", href: "/dashboard#quizzes", icon: IconPin, badge: "!" },
    { key: "assignments", label: "My Assignments", href: "/dashboard#assignments", icon: IconDoc },
    { key: "profile", label: "Profile", href: "/dashboard#profile", icon: IconUser },
  ];

  return (
    <aside className="lms-sidebar" aria-label="Primary">
      <div className="profile">
        <div className="avatar" aria-hidden="true">{(placeholderUser.name || "S").slice(0,1).toUpperCase()}</div>
        <div className="name" title={placeholderUser.email || ""}>{placeholderUser.name}</div>
        <div className="meta">{placeholderUser.role} • Class: Junior</div>
      </div>
      <nav className="menu" aria-label="Sidebar">
        {items.map((it) => {
          const active = location.pathname === it.href || location.hash === it.href.replace("/dashboard", "");
          const Icon = it.icon;
          return (
            <Link
              key={it.key}
              to={it.href}
              className={`menu-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={it.label}
            >
              <Icon className="icon" />
              <span className="label">{it.label}</span>
              {it.badge && (
                <span className="badge" aria-label={`${it.label}, 1 alert`}>!</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Component styles co-located for simplicity; uses CSS variables defined in index.css
// Consumers import this component; CSS class names are namespaced with lms- to avoid conflicts.
