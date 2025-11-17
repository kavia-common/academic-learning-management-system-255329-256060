# LMS Frontend (Supabase-ready)

This app includes mock authentication with role selection and is now Supabase-ready with client utilities and auth callback route. Backend schema and RLS need to be created in your Supabase project (see ../../assets/supabase.md).

## Supabase Environment Variables (required for real auth)
Create `.env` in this folder with:
- REACT_APP_SUPABASE_URL=your-supabase-url
- REACT_APP_SUPABASE_ANON_KEY=your-anon-key
- REACT_APP_SITE_URL=http://localhost:3000

Then restart the dev server.

## Auth Redirects
In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: your dev/prod URL (e.g., http://localhost:3000)
- Redirect URLs: include http://localhost:3000/**

After configuring, email/password sign-up/sign-in will redirect to `/auth/callback`.

Original mock documentation below:
# LMS Frontend (Mock Auth Phase)

This app now includes a mock authentication flow with role selection and route guards. No external services are used.

## New Routes
- `/signin` — Email, password
- `/signup` — Name, email, password, confirm password, role (Student / Instructor / Admin)
- `/dashboard` — Student landing (protected)
- `/instructor` — Instructor landing (protected + instructor only)
- `/admin` — Admin landing (protected + admin only)

## Role-based Redirects
- Student → `/dashboard`
- Instructor → `/instructor`
- Admin → `/admin`

Tip: With mock signin, using `admin@domain.com` signs in as Admin; `instructor@domain.com` as Instructor; all others as Student.

## Dashboard UI
- Implements Sidebar, Header, Cards, and Progress widgets based on assets style guide (Ocean Professional).
- Data is provided by lightweight mock services in `src/services/mockData.js` for:
  - Enrolled courses, progress, upcoming deadlines, announcements.
- Floating feedback tab on the right indicates “Beta”.

## Environment Variables
See `.env.example`. Variables are optional in this phase and will be used when integrating real services (e.g., Supabase).

## Scripts
- `npm start` — Run app at http://localhost:3000
- `npm test` — Run tests
- `npm run build` — Build production bundle
