import React from "react";
import { isSupabaseConfigured } from "../utils/supabaseClient";

/**
 * Renders a small banner to inform users when running in mock mode (Supabase not configured).
 */

// PUBLIC_INTERFACE
export default function MockModeBanner() {
  /** Displays a notice when Supabase is not configured. */
  if (isSupabaseConfigured()) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: "#FFFBEB",
        color: "#92400E",
        border: "1px solid #FDE68A",
        borderRadius: 8,
        padding: "8px 12px",
        margin: "8px 16px",
        fontSize: 12,
      }}
    >
      Mock mode: Supabase is not configured. Auth and data use local mock flows. See assets/supabase.md.
    </div>
  );
}
