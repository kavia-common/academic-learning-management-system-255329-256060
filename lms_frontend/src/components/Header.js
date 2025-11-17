import React from "react";

/**
 * Page header with centered title and quick-links row.
 * Matches student_dashboard_design_notes.md.
 */

// PUBLIC_INTERFACE
export default function Header({ title = "Home", links = [] }) {
  /** Header with title and quick links */
  return (
    <header className="page-header">
      <h1 className="page-title">{title}</h1>
      {links?.length > 0 && (
        <nav className="quick-links" aria-label="Quick links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="quick-link">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
