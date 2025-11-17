import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AuthError() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "generic";

  const titleMap = {
    redirect: "Redirect URL not allowed",
    email: "Email confirmation issue",
    generic: "Authentication error",
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        {titleMap[type] || titleMap.generic}
      </h1>
      <p style={{ marginBottom: 16 }}>
        Please verify your link and try again. If the problem persists, contact support.
      </p>
      <Link to="/signin">Back to sign in</Link>
    </div>
  );
}
