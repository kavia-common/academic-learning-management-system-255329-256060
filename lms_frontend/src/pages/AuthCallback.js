import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "../utils/supabaseClient";
import { handleAuthError } from "../utils/supabaseAuthHelpers";
import { getRedirectPathForRole } from "../services/authService";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (!isSupabaseConfigured()) {
        // If not configured, just route to signin (mock mode doesn't use callback)
        navigate("/signin", { replace: true });
        return;
      }
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      });
      if (error) {
        handleAuthError(error, navigate);
        return;
      }
      // Fetch profile to know role and route appropriately
      const user = data?.session?.user;
      if (!user) {
        navigate("/signin", { replace: true });
        return;
      }
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("role, full_name, email, id")
        .eq("id", user.id)
        .single();
      if (pErr) {
        // Profile may not exist yet; default to Student
        navigate("/dashboard", { replace: true });
        return;
      }
      const role = profile?.role || "Student";
      navigate(getRedirectPathForRole(role), { replace: true });
    };
    run();
  }, [navigate]);

  return <div style={{ padding: 24 }}>Processing authentication...</div>;
}
