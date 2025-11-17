import React from "react";

/**
 * Instructor placeholder page
 * TEMPORARY: Auth disabled — static welcome.
 * TODO(auth): Personalize with user and add sign-out when re-enabled.
 */

// PUBLIC_INTERFACE
export default function Instructor() {
  /** Instructor page placeholder (auth disabled) */
  return (
    <div style={styles.page}>
      <header style={styles.header}><h1 style={styles.h1}>Instructor Area</h1></header>
      <section>
        <p>Welcome, Instructor!</p>
      </section>
    </div>
  );
}

const styles = {
  page: { padding: 24 },
  header: { marginBottom: 16 },
  h1: { fontSize: 22, fontWeight: 600 },
  btn: { background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" },
};
