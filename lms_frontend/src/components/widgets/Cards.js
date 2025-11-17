import React from "react";

/**
 * Generic surface Card with header and body sections.
 */

// PUBLIC_INTERFACE
export function Card({ title, subtitle, children, footer }) {
  /** Visual card with optional title and subtitle */
  return (
    <div className="card">
      {(title || subtitle) && (
        <div className="card-head">
          {title && <div className="card-title">{title}</div>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-foot">{footer}</div>}
    </div>
  );
}
