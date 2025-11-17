import React from "react";

/**
 * Progress bar widget with label and percentage.
 */

// PUBLIC_INTERFACE
export function ProgressBar({ label, value }) {
  /** Accessible progress bar */
  const pct = Math.max(0, Math.min(100, Number(value ?? 0)));
  return (
    <div className="progress">
      <div className="progress-head">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{pct}%</span>
      </div>
      <div className="progress-rail" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="sr-only-progress"
      />
    </div>
  );
}
