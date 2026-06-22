# Titan Portal

Frontend-only React app (Vite + React Router + React-Bootstrap + Font Awesome).

## What's built so far (Phase 1)

- Shared landing page at `/` — Student Login / Create + Teacher Login,
  with the "waiting" loading popup, forgot-password popup, and the
  Student ↔ Teacher switch.
- Full **Teacher Dashboard** at `/teacher/dashboard`:
  - Foldable sidebar (Dashboard / Calendar / Attendance + profile/logout)
  - 4 stat cards + weekly schedule highlight
  - "Active Courses" 2x2 grid (4 batches) with progress bars, clickable
    into a course (placeholder for now)
- Placeholder ("coming next") pages for Calendar, Attendance, Profile,
  and Course Detail — wired into routing so the URLs already work,
  content will be filled in during the next phase.
- Student portal folder is intentionally empty for now — built next.

## Folder structure

```
src/
  components/
    common/Auth/      -> shared landing page, login forms, popups
    teacher/           -> everything teacher-only (layout, dashboard, pages, popups, images)
    student/           -> reserved for the student portal (next phase)
  App.jsx              -> all routes
  App.css              -> global resets only
```

Each component has its own external .css file (no Bootstrap root
override, no grouped selectors) per the project rules.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed http://localhost:5173 URL. Click "Login as
Teacher" on the landing page, fill in anything, wait for the loading
popup, and you'll land on the Teacher Dashboard.

## Notes / things to swap later

- Real Titan logo is now in `components/common/Auth/images/` — full
  crest (`titan-logo.png`, used on the landing page) and a cropped
  shield-only icon (`titan-shield-icon.png`, used in the small sidebar
  spot) so the institute name text isn't squeezed at icon size.
- Brand colors sampled directly from the logo: navy `#142247`
  (primary — buttons, active states) and gold `#CFA561` (small accent
  touches — sidebar active-item border, course batch badge border).
- Teacher avatar is still a generic placeholder illustration — swap
  with a real photo whenever you have one.
