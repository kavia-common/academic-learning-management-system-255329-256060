# LMS Frontend (Supabase Integrated)

The app is wired to Supabase for authentication (email/password) and data (courses, assignments). It gracefully falls back to local mock data when Supabase environment variables are not provided.

See ../../assets/supabase.md for required SQL (tables, RLS, RPCs) and dashboard settings.

## Environment Variables (required for real auth/data)
Create `.env` in this folder (see `.env.example`) with:
- REACT_APP_SUPABASE_URL=your-supabase-url
- REACT_APP_SUPABASE_ANON_KEY=your-anon-key
- REACT_APP_SITE_URL=http://localhost:3000

Then restart the dev server.

If REACT_APP_SUPABASE_* are missing, the UI shows a setup notice and uses mock services for data (Admin/Dashboard will not persist to Supabase).

## Auth Redirects
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: your dev/prod URL (e.g., http://localhost:3000)
- Additional Redirect URLs: include http://localhost:3000/**

After configuring, email/password sign-up/sign-in will redirect to `/auth/callback`.

## Routes and Session
- `/signin` — Email, password (Supabase signInWithPassword)
- `/signup` — Name, email, password, confirm password, role (Student / Instructor / Admin)
  - On sign-up, a row is upserted into `profiles` with the selected role. If email confirmation is required, a temporary session may be shown until confirmation.
- `/auth/callback` — Handles Supabase redirect; reads `profiles.role` to route by role
- `/dashboard` — Student landing (protected)
- `/instructor` — Instructor landing (protected + instructor only)
- `/admin` — Admin landing (protected + admin only)

The AuthContext listens for Supabase auth state changes to keep session current. Role-based navigation is derived from `profiles.role`.

## Data Services
- Admin management (courses/assignments) uses Supabase-backed service when envs exist; otherwise mock localStorage.
- Dashboard attempts RLS-friendly queries for courses and assignments (via `course_assignments` view). If unavailable, falls back to mock dashboard data.

## Migration from Mocks
- Mock auth has been replaced by Supabase flows in `src/services/authService.js`.
- Mock admin data service remains as a fallback when Supabase is not configured.
- Dashboard reads data from Supabase if available; otherwise uses `src/services/mockData.js`.

## Scripts
- `npm start` — Run app at http://localhost:3000
- `npm test` — Run tests
- `npm run build` — Build production bundle
