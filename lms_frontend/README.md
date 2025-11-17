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

## Environment Variables
See `.env.example`. Variables are optional in this phase and will be used when integrating real services (e.g., Supabase).

## Scripts
- `npm start` — Run app at http://localhost:3000
- `npm test` — Run tests
- `npm run build` — Build production bundle
