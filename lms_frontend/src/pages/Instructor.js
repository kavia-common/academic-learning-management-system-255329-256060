import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Instructor placeholder page
 */

// PUBLIC_INTERFACE
export default function Instructor() {
  /** Instructor page placeholder */
  const { user, signOut } = useAuth();
  return (
    <div style={styles.page}>
      <header style={styles.header}><h1 style={styles.h1}>Instructor Area</h1></header>
      <section>
        <p>Welcome, {user?.name || "Instructor"}!</p>
        <button onClick={signOut} style={styles.btn}>Sign out</button>
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
