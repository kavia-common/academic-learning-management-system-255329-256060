# academic-learning-management-system-255329-256060

Supabase Integration
- See assets/supabase.md for required SQL (tables, RLS, RPCs) and dashboard settings.
- Frontend expects REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY, and REACT_APP_SITE_URL (see lms_frontend/.env.example).
- Auth callback route is available at /auth/callback.
- Frontend gracefully falls back to mock data when Supabase is not configured.