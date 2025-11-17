# LMS Frontend (Supabase Integrated)

The app is wired to Supabase for authentication (email/password) and data (courses, assignments). It gracefully falls back to local mock data when Supabase environment variables are not provided.

See ../../assets/supabase.md for required SQL (tables, RLS, RPCs) and dashboard settings.

## Temporary Notice: Authentication Disabled
To unblock runtime errors, the authentication layer is temporarily disabled:
- `AuthProvider` has been replaced by a `NoAuthProvider` that supplies safe defaults.
- `useAuth` returns a non-throwing default when no provider is present.
- `ProtectedRoute` and `RoleGuard` currently allow all routes.
- Sign-in/Sign-up pages render forms and navigate but do not perform real auth.
- Supabase utilities remain intact for future re-enable.

TODO(auth): Restore real `AuthProvider`, guards, and wire SignIn/SignUp to Supabase.

## Environment Variables (required for real auth/data)
Create `.env` in this folder (see `.env.example`) with:
- REACT_APP_SUPABASE_URL=your-supabase-url
- REACT_APP_SUPABASE_ANON_KEY=your-anon-key
- REACT_APP_SITE_URL=http://localhost:3000

Then restart the dev server.

If REACT_APP_SUPABASE_* are missing, the app runs in "mock mode":
- A small banner appears below the header indicating mock mode.
- Supabase client is NOT constructed; services use mock flows (localStorage, in-memory).
- Admin/Dashboard will not persist to Supabase.

## Robust Supabase Guards
- `src/utils/supabaseClient.js` now exports:
  - `isSupabaseConfigured()` — boolean, true when both env vars are present
  - `getSupabase()` — returns a Supabase client when configured, otherwise `null`
  - `supabase` — legacy export (nullable). Prefer `getSupabase()`.
- All services and pages check these guards to avoid runtime errors like "supabaseKey is required".

## Auth Redirects
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: your dev/prod URL (e.g., http://localhost:3000)
- Additional Redirect URLs: include http://localhost:3000/**

After configuring, email/password sign-up/sign-in will redirect to `/auth/callback`.

## Routes and Session
- `/signin` — Email, password (temporarily no real auth)
- `/signup` — Name, email, password, confirm password, role (temporarily no real auth)
- `/auth/callback` — Handles Supabase redirect; no-ops to `/signin` in mock mode
- `/dashboard` — Student landing (temporarily not protected)
- `/instructor` — Instructor landing (temporarily not role-guarded)
- `/admin` — Admin landing (temporarily not role-guarded)

## Data Services
- Admin management (courses/assignments) uses Supabase-backed service when envs exist; otherwise mock localStorage.
- Dashboard attempts public queries when possible; otherwise falls back to mock dashboard data.

## Scripts
- `npm start` — Run app at http://localhost:3000
- `npm test` — Run tests
- `npm run build` — Build production bundle
