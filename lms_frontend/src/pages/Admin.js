import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Admin placeholder page
 */

// PUBLIC_INTERFACE
export default function Admin() {
  /** Admin page placeholder */
  const { user, signOut } = useAuth();
  return (
    <div style={styles.page}>
      <header style={styles.header}><h1 style={styles.h1}>Admin Console</h1></header>
      <section>
        <p>Welcome, {user?.name || "Admin"}!</p>
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
