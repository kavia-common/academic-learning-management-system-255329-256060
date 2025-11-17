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
