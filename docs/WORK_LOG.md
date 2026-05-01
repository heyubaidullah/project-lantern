# Work Log

This file captures what has been completed so far so the project has a durable source of truth.

## Product Direction
The product direction was finalized as a guided daily companion focused on:
- post-Ramadan continuity
- gentle guided reflection
- one action step per day
- accessibility for non-Arabic speakers
- beginner-friendly experience
- a calming, welcoming, and non-overwhelming daily return

## Naming
- Internal codename: Project Lantern
- Product name: Al-Huda
- Public-facing line: One Ayah Forward

## Technical Direction Chosen
- Frontend: Next.js + TypeScript + Tailwind
- Backend: FastAPI
- Data: Supabase
- Hosting: Netlify
- Content source: Quran Foundation APIs

## Major Implementation Milestones Completed

### Setup and Access
- GitHub repository created
- Netlify project deployed
- Supabase project created
- frontend and backend env files set up
- Quran Foundation API access requested and received
- production content access configured
- production deployment fixed and verified

### Backend Work
- token retrieval fixed
- production content endpoints configured
- chapters endpoint working
- verse endpoint working
- translation resources endpoint added
- translation endpoint fixed with correct translation resource id
- live verse + translation integration completed

### Frontend Work
- home page built and improved
- onboarding flow completed
- journey page connected to live content
- pathway-aware content mapping built
- progress/history page built
- about page added
- profile page added
- settings page added
- privacy page added
- disclaimer page added
- footer added
- theme toggle added
- theme rollout across major pages completed
- chapter preview cards made clickable
- pathway cards enhanced with icons
- helpful resources section added
- signed-in shell improved
- visual polish pass completed

### Authentication and User Identity
- Supabase Auth integrated
- Google sign-in implemented
- email magic link implemented
- logout flow implemented
- route protection implemented
- first name and last name collection added to onboarding
- user-linked profile creation and persistence implemented

### Persistence and Progress
- onboarding persistence implemented
- reflection persistence implemented
- progress/history connected to saved data
- per-user journey progression implemented
- per-user streak tracking implemented
- returning users skip repeated onboarding

## UI / Product Notes
- the `۝` motif is being used as the symbolic visual identity across the app
- gold and blue accents are now part of the product’s visual language
- the experience is intentionally designed to feel welcoming, calm, practical, and non-overwhelming
- Home page section ordering and signed-in flow were refined to better support returning users

## Deferred to Next Versions
- auth-aware guided pathway CTA behavior on Home
- editable profile details
- deeper settings controls
- groups / friends / circles
- shared reminders or accountability features
- database-managed pathway authoring
- native mobile apps